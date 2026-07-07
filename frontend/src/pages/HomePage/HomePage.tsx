import { Hero } from '@/widgets/Hero'
import { LatestNews } from '@/widgets/LatestNews'
import { Menu } from '@/widgets/Menu'
import { WhereToFindUs } from '@/widgets/WhereToFindUs'
import { Faq } from '@/widgets/Faq'

// const images = Object.entries(
//   import.meta.glob('@/assets/images/*.webp', { eager: true, import: 'default' }),
// )
//   .sort(([a], [b]) => a.localeCompare(b))
//   .map(([, src]) => src as string)

function HomePage() {
  return (
    <>
      {/* <div style={{ padding: '20px' }}>
        {images.map((src) => (
          <img key={src} src={src} alt='' style={{ marginBottom: '20px' }} />
        ))}
      </div> */}
      <Hero />
      <LatestNews />
      <Menu />
      <WhereToFindUs />
      <Faq />
    </>
  )
}

export default HomePage
