import { Outlet } from 'react-router-dom'

function AdminLayout() {
  return (
    <>
      <main className='center'>
        <Outlet />
      </main>
    </>
  )
}

export default AdminLayout
