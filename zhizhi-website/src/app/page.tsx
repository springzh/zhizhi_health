import Hero from '../components/Hero'
import Services from '../components/Services'
import Doctors from '../components/Doctors'
import FAQSection from '../components/FAQSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Services />
      <Doctors />
      <FAQSection />
      <Footer />
    </div>
  )
}