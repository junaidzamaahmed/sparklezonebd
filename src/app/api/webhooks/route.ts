import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/utils/db";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  if (evt.type === "user.created") {
    try {
      // Set metadata role
      const client = await clerkClient();
      await client.users.updateUserMetadata(evt.data.id, {
        publicMetadata: {
          isAdmin: false,
        },
      });
      const user = await db.user.create({
        data: {
          clerkId: evt.data.id,
          email: evt.data.email_addresses[0].email_address,
          name: evt.data.first_name + " " + evt.data.last_name,
        },
      });
      console.log("User created:", user);
    } catch (error) {
      console.error("Error: Could not create user", error);
    }
  }
  if (evt.type === "user.deleted") {
    try {
      await db.user.delete({
        where: { clerkId: evt.data.id },
      });
    } catch (error) {
      console.error("Error: Could not delete user", error);
    }
  }
  if (evt.type === "user.updated") {
    try {
      await db.user.update({
        where: { clerkId: evt.data.id },
        data: {
          name: evt.data.first_name + " " + evt.data.last_name,
          email: evt.data.email_addresses[0].email_address,
        },
      });
    } catch (error) {
      console.error("Error: Could not update user", error);
    }
  }

  return new Response("Webhook received", { status: 200 });
}
