import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Trusted from '../components/Trusted'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import DashboardPreview from '../components/DashboardPreview'
import Stats from '../components/Stats'
import FAQ from '../components/FAQ'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-[#09090B] text-white overflow-hidden font-sans">
      {/* Global Glow Highlights */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-1/4 w-[500px] h-[500px] bg-indigo-500/3 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-1/3 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Main Structural Elements */}
      <Navbar />
      
      <div className="relative z-10">
        <Hero />
        <Trusted />
        <Features />
        <HowItWorks />
        <DashboardPreview />
        <Stats />
        <FAQ />
        <CTA />
      </div>

      <Footer />
    </div>
  )
}
