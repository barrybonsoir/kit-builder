

export const metadata = {
  title: 'Team Fair Weather',
  description: 'Neutral Pride for 2026',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: 'white' }}>{children}</body>
    </html>
  )
}