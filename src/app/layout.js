import './globals.css'
import { Montserrat, Inter, JetBrains_Mono } from 'next/font/google'
import Navbar from '@/components/common/Navbar'
import BackButton from '@/components/common/BackButton'
import JoinModal from '@/components/common/JoinModal'
import Footer from '@/components/common/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { JoinModalProvider } from '@/contexts/JoinModalContext'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-montserrat',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jetbrains-mono',
})

export const metadata = {
  title: 'codeXperts Club',
  description: 'Official website of codeXperts Club',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${inter.variable} ${jetbrainsMono.variable} font-inter bg-bg-base text-text-primary antialiased`}>
        <AuthProvider>
          <JoinModalProvider>
            <Navbar />
            <JoinModal />
            <div className="pt-14">
              <BackButton />
              {children}
            </div>
            <Footer />
          </JoinModalProvider>
        </AuthProvider>
      </body>
    </html>
  )
}