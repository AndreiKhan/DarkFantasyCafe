import { Loader } from '@/shared/ui'
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

function AdminLayout() {
  return (
    <>
      <main className='center'>
        <Suspense fallback={<Loader width='200px' height='200px' />}>
          <Outlet />
        </Suspense>
      </main>
    </>
  )
}

export default AdminLayout
