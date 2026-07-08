import homeBg from '@/assets/images/home-image.webp'
import authBg from '@/assets/images/login-image.webp'
import reserveBg from '@/assets/images/reserve-image.webp'
import newsBg from '@/assets/images/news-image.webp'
import profileBg from '@/assets/images/profile-image.webp'
import characterBg from '@/assets/images/character-image.webp'

const PAGE_BACKGROUNDS: { test: (pathname: string) => boolean, variant: string, image: string }[] = [
  { test: (p) => p === '/', variant: 'home', image: homeBg },
  { test: (p) => p.startsWith('/login') || p.startsWith('/register'), variant: 'auth', image: authBg },
  { test: (p) => p.startsWith('/reserve'), variant: 'reserve', image: reserveBg },
  { test: (p) => p.startsWith('/news'), variant: 'news', image: newsBg },
  { test: (p) => p.startsWith('/profile'), variant: 'profile', image: profileBg },
  { test: (p) => p.startsWith('/characters'), variant: 'character', image: characterBg },
]

export function getPageBackground(pathname: string) {
  return PAGE_BACKGROUNDS.find(({ test }) => test(pathname)) ?? null
}
