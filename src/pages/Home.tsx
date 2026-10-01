import Header from '../sections/Header'
import Hero from '../sections/Hero'
import FeaturedPlants from '../sections/FeaturedPlants'
import PickupInfo from '../sections/PickupInfo'
import ContactCta, { Footer, WhatsAppFloat } from '../sections/Contact'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturedPlants />
        <PickupInfo />
        <ContactCta />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
