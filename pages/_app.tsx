import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { createContext, useState } from 'react'

import { AlertContext } from '@/context'

import { Alert } from '@mui/material'
import type { AlertColor } from '@mui/material/Alert'

export default function App({ Component, pageProps }: AppProps) {
  const [alertState, setAlertState] = useState({
    message: '123',
    severity: 'success' as AlertColor,
    open: false
  })

  const showAlert = (message: string, severity: AlertColor): void => {
    setAlertState({
      message,
      severity,
      open: true
    })

    setTimeout(() => {
      setAlertState({
        ...alertState,
        open: false
      })
    }, 1500)
  }

  const alert_style = {
    position: 'fixed',
    top: '10px',
    left: '50%',
    transform: 'translate(-50%, 0)',
    minWidth: '300px',
    zIndex: 9999
  }

  return (
    <AlertContext.Provider value={showAlert}>
      {alertState.open && (
        <Alert
          severity={alertState.severity}
          sx={alert_style}
          onClose={() => {
            setAlertState({
              ...alertState,
              open: false
            })
          }}
        >
          {alertState.message}
        </Alert>
      )}
      <Component {...pageProps} />
    </AlertContext.Provider>
  )
}
