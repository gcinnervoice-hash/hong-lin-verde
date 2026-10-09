import Header from '../sections/Header'
import Hero from '../sections/Hero'
import WhyUs from '../sections/WhyUs'
import ContactCta, { Footer } from '../sections/Contact'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <WhyUs />
        <ContactCta />
      </main>
      <Footer />
    </div>
  )
}
