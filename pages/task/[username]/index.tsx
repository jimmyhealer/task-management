import { useRouter } from 'next/router'
import { useEffect } from 'react'

import WithAuth from '@/hoc/withAuth'

const Error = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/task')
  }, [router])

  return (
    <div>
      <h1>404</h1>
      <p>Page not found</p>
    </div>
  )
}

export default WithAuth(Error)