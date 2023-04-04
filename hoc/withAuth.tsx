import { useRouter } from 'next/router'
import { ComponentType, useEffect, useContext, useState } from 'react'

import { AlertContext } from '@/context'

export default function WithAuth(WrappedComponent: ComponentType) {
  return function (props: any) {
    const showAlert = useContext(AlertContext)
    const router = useRouter()
    const [token, setToken] = useState<string | null>(null)
    const [isClientSide, setIsClientSide] = useState(false)

    useEffect(() => {
      const newToken = window.sessionStorage.getItem('token')
      if (newToken !== token) {
        setToken(newToken)
      } else {
        showAlert('Please login first', 'error')
        router.push('/')
      }
      setIsClientSide(true)
    }, [])

    if (!isClientSide || !token) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}