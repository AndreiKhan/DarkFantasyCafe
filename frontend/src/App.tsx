import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { AchievementToastProvider } from '@/entities/Achievement'
import { router } from '@/app/router'

function App() {
  return (
    <QueryProvider>
      <AchievementToastProvider>
        <RouterProvider router={router} />
      </AchievementToastProvider>
    </QueryProvider>
  )
}

export default App
