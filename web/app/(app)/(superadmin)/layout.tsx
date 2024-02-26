export const metadata = {
  title: "Terralab : Invite Organization",
  description: "Invite Organization by super admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
