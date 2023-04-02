import { useEffect, useState } from 'react'
import Link from 'next/link'

import { Container, Card, CardContent, List, ListItem } from '@mui/material'
import { textAlign } from '@mui/system'

async function getRepos(): Promise<any> {
  const token = window.sessionStorage.getItem('token')

  try {
    const res = await fetch('/api/user/repos?sort=updated', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}

function RepoComponent(repo: any) {
  return (
    <div style={{
      borderBottom: '1px solid #e7ebf0',
      padding: '10px 0'
    }}>
      <Link href={`/task/${repo.owner.login}/${repo.name}`} key={repo.id}>
        <div key={repo.id}>
          <h2>
            {repo.owner.login}/{repo.name}
          </h2>
          <div style={{
            display: 'flex',
            marginTop: '8px'
          }}>
            <p>Issue number: </p>
            <p style={{
              fontWeight: 'bold',
              marginLeft: '4px',
            }}>{repo.open_issues_count}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}

function RepoList() {
  const [repos, setRepos] = useState([])

  useEffect(() => {
    getRepos().then(data => {
      setRepos(data)
    })
  }, [])

  return (
    <Card>
      <CardContent>
        {repos.map((repo: any, index: number) => {
          return <RepoComponent {...repo} key={index} />
        })}
      </CardContent>
    </Card>
  )
}

export default function TaskList() {
  return (
    <div
      style={{
        backgroundColor: '#e7ebf0',
        minHeight: '100vh',
        padding: '20px 0'
      }}
    >
      <Container>
        <h1>Project</h1>
        <RepoList />
      </Container>
    </div>
  )
}
