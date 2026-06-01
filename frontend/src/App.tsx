import Header from './widgets/Header/Header'
import Footer from './widgets/Footer/Footer'
import Menu from './widgets/Menu/Menu'
import InteractiveReserve from './widgets/InteractiveReserve/InteractiveReserve'
import WhereToFindUs from './widgets/WhereToFindUs/WhereToFindUs'
import Faq from './widgets/Faq/Faq'
import Hero from './widgets/Hero/Hero'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Menu />
        <InteractiveReserve />
        <WhereToFindUs />
        <Faq />
      </main>
      <Footer />
    </>
  )
}

export default App
