export const metadata = {
  title: "Fair Weather Fandom",
  description: "Why cheer for just one?",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}