import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/app/layouts/MainLayout'
import { default as HomePage } from '@/pages/HomePage/HomePage'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
])