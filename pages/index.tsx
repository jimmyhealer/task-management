import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { Card, CardContent, Container, Button } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'

async function Login(code: string): Promise<string> {
  try {
    const res = await fetch(
      `/github/login/oauth/access_token?client_id=24260c7de28ce45f53b5&client_secret=${process.env.CLIENT_SECRET}&code=${code}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    const data = await res.json()
    return data.access_token
  } catch (err) {
    console.error(err)
    throw err
  }
}

export default function Home() {
  const router = useRouter()
  const { code } = router.query

  const [isLogin, setIsLogin] = useState(false)

  useEffect(() => {
    const token = window.sessionStorage.getItem('token')
    setIsLogin(token !== null)
  }, [])

  useEffect(() => {
    if (isLogin) {
      router.push('/task')
    } else if (code) {
      Login(code as string).then(access_token => {
        window.sessionStorage.setItem('token', access_token)
        setIsLogin(true)
        router.push('/task')
      })
    }
  }, [isLogin, code])

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
