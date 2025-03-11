import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import FeaturesSection from "@/components/features-section"
import MintSection from "@/components/mint-section"
import Footer from "@/components/footer"
import { WalletProvider } from "@/hooks/use-wallet"

export default function Home() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <Header />
        <main>
          <HeroSection />
          <AboutSection />
          <FeaturesSection />
          <MintSection />
        </main>
        <Footer />
      </div>
    </WalletProvider>
  )
}

