import { Hero } from '@/widgets/Hero'
import { Menu } from '@/widgets/Menu'
import { InteractiveReserve } from '@/widgets/InteractiveReserve'
import { WhereToFindUs } from '@/widgets/WhereToFindUs'
import { Faq } from '@/widgets/Faq'

function HomePage() {
  return (
    <>
      <Hero />
      <Menu />
      <InteractiveReserve />
      <WhereToFindUs />
      <Faq />
    </>
  )
}

export default HomePage