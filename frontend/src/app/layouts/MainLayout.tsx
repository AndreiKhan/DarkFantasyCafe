import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'

function MainLayout() {
  return (
    <>
      <Header />
      <main>
        {/* <Outlet /> */}
        {children}
      </main>
      <Footer />
    </>
  )
}