import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { getPageBackground } from './getLayoutBg'
import './MainLayout.scss'

function MainLayout() {
  const { pathname } = useLocation()
  const background = getPageBackground(pathname)

  return (
    <>
      {background &&
        <div className={`layout__bg layout__bg--${background.variant}`} aria-hidden>
          <img src={background.image} alt='' />
        </div>
      }
      <div className='page-shell'>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default MainLayout
