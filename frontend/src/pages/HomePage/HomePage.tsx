import { Hero } from '@/widgets/Hero'
import { LatestNews } from '@/widgets/LatestNews'
import { Menu } from '@/widgets/Menu'
import { WhereToFindUs } from '@/widgets/WhereToFindUs'
import { Faq } from '@/widgets/Faq'

function HomePage() {
  return (
    <>
      <Hero />
      <LatestNews />
      <Menu />
      <WhereToFindUs />
      <Faq />
    </>
  )
}

export default HomePage
