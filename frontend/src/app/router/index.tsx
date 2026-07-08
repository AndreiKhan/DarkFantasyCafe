import { createBrowserRouter, redirect } from 'react-router-dom'
import { default as RequireRole } from './RequireRole'
import MainLayout from '@/app/layouts/MainLayout'
import AdminLayout from '@/app/layouts/AdminLayout'
import HomePage from '@/pages/HomePage/HomePage'
import LoginPage from '@/pages/LoginPage/LoginPage'
import RegisterPage from '@/pages/RegisterPage/RegisterPage'
import ReservationPage from '@/pages/ReservationPage/ReservationPage'
import ReservationSuccessPage from '@/pages/ReservationSuccessPage/ReservationSuccessPage'
import NewsPage from '@/pages/NewsPage/NewsPage'
import NewsSlugPage from '@/pages/NewsSlugPage/NewsSlugPage'
import ProfilePage from '@/pages/ProfilePage/ProfilePage'
import CharactersPage from '@/pages/CharactersPage/CharactersPage'
import CharacterCreatePage from '@/pages/CharacterCreatePage/CharacterCreatePage'
import CharacterPage from '@/pages/CharacterPage/CharacterPage'
import AdminPage from '@/pages/AdminPage/AdminPage'
import { getMe } from '@/entities/Auth'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <RequireRole />,
        children: [
          { path: 'reserve', element: <ReservationPage /> },
          { path: 'reserve/success', element: <ReservationSuccessPage /> },
          { path: 'characters/new', element: <CharacterCreatePage /> },
        ],
      },
      { path: 'news', element: <NewsPage /> },
      { path: 'news/:slug', element: <NewsSlugPage /> },
      { path: 'characters', element: <CharactersPage /> },
      { path: 'characters/:id', element: <CharacterPage /> },
      {
        path: 'profile',
        loader: async () => {
          try {
            const { user } = await getMe()
            return redirect(`/profile/${user.sub}`)
          } catch {
            return redirect('/login')
          }
        },
      },
      { path: 'profile/:userId', element: <ProfilePage /> },
    ],
  },
  {
    element: <RequireRole role='ADMIN' />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: 'admin', element: <AdminPage /> },
        ],
      },
    ],
  },
])
