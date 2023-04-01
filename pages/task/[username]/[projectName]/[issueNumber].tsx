import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

async function getRepoIssueDetail(owner: string, projectName: string, issueNumber: string) : Promise<Object[]> {
  const token = window.sessionStorage.getItem('token')

  try {
    const res = await fetch(`/api/repos/${owner}/${projectName}/issues/${issueNumber}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if(res.status != 200) {
      throw new Error(`${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    return data
  } catch (err) {
    throw err
  }
}

export default function TaskDetail() {
  const router = useRouter()
  const { username, projectName, issueNumber } = router.query as { username: string, projectName: string, issueNumber: string }

  const [issue, setIssue] = useState({} as any)

  useEffect(() => {
    if (!username || !projectName || !issueNumber) return
    getRepoIssueDetail(username, projectName, issueNumber)
    .then((data) => {
      setIssue(data)
    })
    .catch((err) => {
      console.error(err)
    })
  }, [username, projectName, issueNumber])
  
  return (
    <div>
      <h1>TaskDetail</h1>
      <p>username: {username} </p>
      <p>projectName: {projectName} </p>
      <p>issueNumber: {issueNumber} </p>
      <div>
        <p>title: {issue.title}</p>
        <p>body: {issue.body}</p>
      </div>
    </div>
  )
}