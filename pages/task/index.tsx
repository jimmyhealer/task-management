import { useEffect, useState } from "react"
import Link from 'next/link'

async function getRepos(): Promise<any> {
  const token = window.sessionStorage.getItem('token')

  try {
    const res = await fetch('/api/user/repos', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}

function RepoList() {
  const [repos, setRepos] = useState([])

  useEffect(() => {
    getRepos()
    .then((data) => {
      setRepos(data)
    })
  }, [])

  return (
    <>
      {
        repos.map((repo: any) => {
          return (
            <Link href={`/task/${repo.owner.login}/${repo.name}`} key={repo.id}>            
              <div key={repo.id}>
                <h2>{repo.name}</h2>
                <p>{repo.description}</p>
                <div>
                  <p>Issue number: </p>
                  <p>{repo.open_issues_count}</p>
                </div>
              </div>
            </Link>
          )
        })
      }
    </>
  )
}


export default function TaskList() {
  return (
    <div>
      <h1>Task</h1>
      <RepoList />
    </div>
  )
}