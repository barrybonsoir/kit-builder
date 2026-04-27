export const metadata = {
  title: "Fair Weather Fandom",
  description: "The definitive loyalty mapping tool for the undecided fan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}