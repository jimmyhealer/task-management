import { useRouter } from 'next/router'

export default function TaskDetail() {
  const router = useRouter()
  const { slug } = router.query as { slug: string[] }

  if (!slug) {
    return <div>Loading...</div>
  }

  if (slug.length !== 3) {
    return <div>Error</div>
  }

  const username = slug[0]
  const projectName = slug[1]
  const issueNumber = slug[2]

  return (
    <div>
      <h1>TaskDetail</h1>
      <p>username: {username}</p>
      <p>projectName: {projectName}</p>
      <p>issueNumber: {issueNumber}</p>
    </div>
  )
}