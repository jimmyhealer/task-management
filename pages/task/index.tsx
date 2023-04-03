import { useEffect, useState } from 'react'
import Link from 'next/link'

import { getRepos } from '@/api'

import { Container, Card, CardContent } from '@mui/material'

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
