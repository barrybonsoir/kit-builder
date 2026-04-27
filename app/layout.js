export const metadata = {
  title: "Fair Weather Fandom",
  description: "What to choose when you don't know who to choose.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}