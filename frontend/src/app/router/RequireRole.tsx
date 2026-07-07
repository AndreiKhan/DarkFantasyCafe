import { Navigate, Outlet } from 'react-router-dom'
import { useMe } from '@/entities/Auth'
import { Loader } from '@/shared/ui'

function RequireRole({ role }: { role?: string }) {
  const { data, isLoading } = useMe()

  if (isLoading) {
    return <Loader width='200px' height='200px' />
  }

  const user = data?.user

  if (!user) {
    return <Navigate to='/login' replace />
  }

  if (role && user.role !== role) {
    return <Navigate to='/' replace />
  }

  return <Outlet />
}

export default RequireRole
