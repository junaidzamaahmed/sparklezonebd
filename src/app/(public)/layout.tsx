import LayoutComponent from "./_components/layoutComponent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutComponent>{children}</LayoutComponent>;
}
