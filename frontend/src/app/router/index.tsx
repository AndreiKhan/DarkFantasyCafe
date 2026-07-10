import { createBrowserRouter, redirect } from 'react-router-dom'
import { default as RequireRole } from './RequireRole'
import { getMe } from '@/entities/Auth'
import { lazy } from 'react'
import MainLayout from '@/app/layouts/MainLayout'
import AdminLayout from '@/app/layouts/AdminLayout'
import HomePage from '@/pages/HomePage/HomePage'
import LoginPage from '@/pages/LoginPage/LoginPage'

const RegisterPage = lazy(() => import('@/pages/RegisterPage/RegisterPage'))
const ReservationPage = lazy(() => import('@/pages/ReservationPage/ReservationPage'))
const ReservationSuccessPage = lazy(() => import('@/pages/ReservationSuccessPage/ReservationSuccessPage'))
const NewsPage = lazy(() => import('@/pages/NewsPage/NewsPage'))
const NewsSlugPage = lazy(() => import('@/pages/NewsSlugPage/NewsSlugPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage/ProfilePage'))
const CharactersPage = lazy(() => import('@/pages/CharactersPage/CharactersPage'))
const CharacterCreatePage = lazy(() => import('@/pages/CharacterCreatePage/CharacterCreatePage'))
const CharacterPage = lazy(() => import('@/pages/CharacterPage/CharacterPage'))
const AdminPage = lazy(() => import('@/pages/AdminPage/AdminPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage/NotFoundPage'))

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
      { path: '*', element: <NotFoundPage /> },
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
