import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './routers/router'
import { RouterProvider } from 'react-router-dom'
import AuthProvider from './provider/AuthProvider'
import { ThemeProvider } from '@material-tailwind/react'
import { DarkModeProvider } from './provider/DarkModeProvider'
// import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </DarkModeProvider>
  </StrictMode>,
)
