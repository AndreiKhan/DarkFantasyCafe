import { useProfile } from '@/entities/User'

function ProfilePage() {
  const { data, isLoading, isError } = useProfile()

  if (isLoading) {
    return <p>isLoading</p>
  }
  if (isError || !data) {
    return <p>isError</p>
  }

  return (
    <section className="center">
      <h1>{data.firstName} {data.secondName}</h1>
      {data.image &&
        <img src={data.image} />
      }
      <p>{data.email}</p>
      <p>{data.phone}</p>
      <p>{data.role}</p>
    </section>
  )
}

export default ProfilePage