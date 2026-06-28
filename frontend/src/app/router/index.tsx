import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/app/layouts/MainLayout'
import HomePage from '@/pages/HomePage/HomePage'
import LoginPage from '@/pages/LoginPage/LoginPage'
import RegisterPage from '@/pages/RegisterPage/RegisterPage'
import ReservationPage from '@/pages/ReservationPage/ReservationPage'
import ReservationSuccessPage from '@/pages/ReservationSuccessPage/ReservationSuccessPage'
import NewsPage from '@/pages/NewsPage/NewsPage'
import NewsSlugPage from '@/pages/NewsSlugPage/NewsSlugPage'
import ProfilePage from '@/pages/ProfilePage/ProfilePage'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'reserve', element: <ReservationPage /> },
      { path: 'reserve/success', element: <ReservationSuccessPage /> },
      { path: 'news', element: <NewsPage /> },
      { path: 'news/:slug', element: <NewsSlugPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
])