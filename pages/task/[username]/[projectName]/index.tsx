import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

import InfiniteScroll from 'react-infinite-scroll-component';

async function getRepoIssues(owner: string, projectName: string, search: string, labels: string, desc: string, page: number): Promise<Object[]> {
  const token = window.sessionStorage.getItem('token')
  try {
    let q = `in:issue repo:${owner}/${projectName}`
    if (search) {
      q += `+${search}`
    }

    if (labels) {
      let label_item = labels.split(',')
      let label_tmp = [] as string[]
      label_item.forEach((label) => {
        if (label == '') return
        if (label[0] == '-') {
          q += `+-label:${label.slice(1)}`
        } else {
          label_tmp.push(label)
        }
      })
      if (label_tmp.length > 0) {
        q += `+label:${label_tmp.join(',')}`
      }
    }    

    const res = await fetch(`/api/search/issues?q=${q}&sort=created&order=${desc}&per_page=10&page=${page}`, {
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
    return data.items
  } catch (err) {
    throw err
  }
}

function TaskItem({ issue }: any) {
  return (
    <div style={{
      height: '200px'
    }}>
      <Link href={`/task/${issue.user.login}/${issue.repository_url.split('/')[5]}/${issue.number}`}>        
        <h2>{issue.title}</h2>
        <p>
          {issue.labels.map((label: any) => (
            <span key={label.id} style={{ backgroundColor: `#${label.color}` }}>
              {label.name}
            </span>
          ))}
        </p>
      </Link>
    </div>
  )
}

type IssueStatus = {
  open: boolean
  in_progress: boolean
  done: boolean
}

export default function TaskList() {
  const router = useRouter()
  const { 
    username, projectName, Q, labels, qdesc 
  } = router.query as { 
    username: string, projectName: string, Q: string, labels: string, qdesc: string 
  }

  const [issues, setIssues] = useState([] as Object[])
  const [search, setSearch] = useState(Q || '')
  const [desc, setDesc] = useState(qdesc || 'desc')

  const [page, setPage] = useState(1)

  const [status, setStatus] = useState<IssueStatus>({
    open: true,
    in_progress: true,
    done: true,
  })

  const fetchData = (_page: number) => {
    console.log(_page)
    getRepoIssues(username, projectName, search, labels, desc, _page)
    .then((data) => {
      setIssues([...issues, ...data])
    })
    .catch((err) => {
      console.error(err)
    })
  }

  useEffect(() => {
    if (!username || !projectName) return
    setSearch(Q || '')
    fetchData(page)
  }, [username, projectName, Q, labels, qdesc])

  let filter = ''

  useEffect(() => {
    if (!username || !projectName) return

    if (status.in_progress != status.open) {
      filter += `${status.open ? '-' : ''}"In Progress",`
    }
    if (status.done != status.open) {
      filter += `${status.open ? '-' : ''}"Done",`
    }

    routerPush(search, filter, desc)
  }, [status])

  function routerPush(q: string, l: string, d: string) {
    router.push(
      {
        pathname: `/task/${username}/${projectName}`,
        query: { Q: q, labels: l, qdesc: d},
      },
      undefined,
      { shallow: true }
    )
  }

  const updateStatus = (key: keyof IssueStatus) => {
    setStatus({
      ...status,
      [key]: !status[key],
    })
  }

  return (
    <div>
      <h1>TaskList</h1>
      <a href={`https://github.com/${username}/${projectName}`} target="_blank">Go to github</a>
      <p>username: {username} </p>
      <p>projectName: {projectName} </p>

      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}/>
      <button onClick={() => routerPush(search, filter, desc)}>Search</button>

      <br />

      <button onClick={() => updateStatus('open')}>
        {status.open ? 'Open' : '!open'}
      </button>
      <button onClick={() => updateStatus('in_progress')}>
        {status.in_progress ? 'In Progress' : '!In Progress'}
      </button>
      <button onClick={() => updateStatus('done')}>
        {status.done ? 'Done' : '!Done'}
      </button>

      <button onClick={() => {
        let d = desc == 'desc' ? 'asc' : 'desc'
        setDesc(d)
        routerPush(search, filter, d)
      }}>{desc}</button>

      <InfiniteScroll
        dataLength={issues.length}
        next={() => {
          setPage(page + 1)
          fetchData(page + 1)
        }}
        hasMore={true}
        loader={null}
      >   {issues.map((issue: any) => {
            return (
              <TaskItem issue={issue} key={issue.id} />
            )
          })}
      </InfiniteScroll>
    </div>
  )
}