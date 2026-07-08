export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  reserve: '/reserve',
  reserveSuccess: '/reserve/success',
  news: '/news',
  profile: '/profile',
  profileUser: (userId: string) => `/profile/${userId}` as const,
  characters: '/characters',
  characterNew: '/characters/new',
  character: (id: string) => `/characters/${id}` as const,
  admin: '/admin',
} as const