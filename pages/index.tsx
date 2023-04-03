import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'

import { Login } from '@/api'
import { AlertContext } from '@/context'

import { Card, CardContent, Container, Button } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'

export default function Home() {
  const showAlert = useContext(AlertContext)
  const router = useRouter()
  const { code } = router.query

  const [isLogin, setIsLogin] = useState(false)

  useEffect(() => {
    const token = window.sessionStorage.getItem('token')
    setIsLogin(token !== null && token !== 'undefined')
  }, [])

  useEffect(() => {
    if (isLogin) {
      router.push('/task')
    } else if (code) {
      Login(code as string).then(access_token => {
        if (access_token === null) {
          showAlert('Login failed', 'error')
        } else {
          showAlert('Login success', 'success')
          window.sessionStorage.setItem('token', access_token)
          setIsLogin(true)
          router.push('/task')
        }
      })
    }
  }, [router, isLogin, code])

  return (
    <>
      <main
        style={{
          backgroundColor: '#e7ebf0',
          height: '100vh'
        }}
      >
        <Container
          maxWidth="sm"
          style={{
            padding: '40vh 0'
          }}
        >
          <Card
            style={{
              height: '300px'
            }}
          >
            <CardContent
              style={{
                textAlign: 'center'
              }}
            >
              <h1
                style={{
                  fontSize: '3rem'
                }}
              >
                Task Management
              </h1>
              <h2>Dcard 2023 Frontend Intern Homework</h2>
              <Button
                variant="contained"
                href="https://github.com/login/oauth/authorize?client_id=24260c7de28ce45f53b5&scope=repo"
                startIcon={<GitHubIcon />}
                style={{
                  marginTop: '55px'
                }}
              >
                Login with Github
              </Button>
            </CardContent>
          </Card>
        </Container>
      </main>
    </>
  )
}
