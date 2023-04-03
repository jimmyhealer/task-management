import { createContext } from 'react'
import type { AlertColor } from '@mui/material/Alert'

export const AlertContext = createContext((message: string, severity: AlertColor): void => {})
