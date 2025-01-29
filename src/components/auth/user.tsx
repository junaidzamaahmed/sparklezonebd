import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function User() {
  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
