import Header from '../components/Header'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Doctors from '../components/Doctors'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <Doctors />
      </main>
      <Footer />
    </div>
  )
}