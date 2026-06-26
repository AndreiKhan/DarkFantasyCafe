import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/app/layouts/MainLayout'
import HomePage from '@/pages/HomePage/HomePage'
import LoginPage from '@/pages/LoginPage/LoginPage'
import RegisterPage from '@/pages/RegisterPage/RegisterPage'
import ReservationPage from '@/pages/ReservationPage/ReservationPage'
import ReservationSuccessPage from '@/pages/ReservationSuccessPage/ReservationSuccessPage'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'reserve', element: <ReservationPage /> },
      { path: 'reserve/success', element: <ReservationSuccessPage /> },
    ],
  },
])