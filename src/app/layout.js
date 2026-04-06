import './globals.css'
import Navbar from '@/components/common/Navbar'

export const metadata = {
  title: 'codeXperts Club',
  description: 'Official website of codeXperts Club',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <Navbar />
        <div className="pt-14">
          {children}
        </div>
      </body>
    </html>
  )
}
