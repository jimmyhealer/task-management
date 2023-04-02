import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

import { isColorDark } from '@/utils'

import InfiniteScroll from 'react-infinite-scroll-component'
import {
  Container,
  TextField,
  Button,
  ButtonGroup,
  Card,
  Typography,
  IconButton,
} from '@mui/material'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

async function getRepoTask(
  owner: string,
  projectName: string,
  search: string,
  labels: string,
  order: string,
  page: number
): Promise<Object[]> {
  const token = window.sessionStorage.getItem('token')
  try {
    let q = `in:issue repo:${owner}/${projectName}`

    if (search) {
      q += `+${search}`
    }

    if (labels) {
      let label_item = labels.split(',')
      let label_tmp = [] as string[]
      label_item.forEach(label => {
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

    const res = await fetch(
      `/api/search/issues?q=${q}&sort=created&order=${order}&per_page=10&page=${page}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (res.status != 200) {
      throw new Error(`${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    return data.items
  } catch (err) {
    throw err
  }
}

function TaskItem({ task }: any) {
  return (
    <div
      style={{
        borderBottom: '1px solid #e7ebf0',
        padding: '10px 0',
        height: '100px'
      }}
    >
      <Link
        href={`/task/${task.user.login}/${task.repository_url.split('/')[5]}/${
          task.number
        }`}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <h2
            style={{
              marginRight: '8px',
              fontSize: '1.5rem',
            }}
          >
            {task.title} #{task.number}
          </h2>
          <p>
            {task.labels.map((label: any) => (
              <span
                key={label.id}
                style={{
                  backgroundColor: `#${label.color}`,
                  borderRadius: '15px',
                  color: `#${isColorDark(label.color) ? 'fff' : '000'}`,
                  padding: '2px 8px',
                  margin: '0 2px'
                }}
              >
                {label.name}
              </span>
            ))}
          </p>
        </div>
        <Typography
          variant="body2"
          component="p"
          style={{
            color: '#6e6e6e',
            maxHeight: '60px',
            maxWidth: '80%',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }}
        >
          {task.body}
        </Typography>
      </Link>
    </div>
  )
}

type Tasktatus = {
  open: boolean
  in_progress: boolean
  done: boolean
}

export default function TaskList() {
  const router = useRouter()
  const { username, projectName, Q, labels, qorder } = router.query as {
    username: string
    projectName: string
    Q: string
    labels: string
    qorder: string
  }

  const [Task, setTask] = useState([] as Object[])
  const [search, setSearch] = useState(Q || '')
  const [order, setOrder] = useState(qorder || 'desc')
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<Tasktatus>({
    open: true,
    in_progress: true,
    done: true
  })

  const fetchData = (
    _search: string,
    _labels: string,
    _order: string,
    _page: number
  ): void => {
    getRepoTask(username, projectName, _search, _labels, _order, _page)
      .then(data => {
        if (_page == 1) {
          setTask(data)
        }
        else {
          setTask(prevTask => [...prevTask, ...data])
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

  const statusToLabels = (_status: Tasktatus): string => {
    let labels = ''

    if (_status.in_progress != _status.open) {
      labels += `${_status.open ? '-' : ''}"In Progress",`
    }
    if (_status.done != _status.open) {
      labels += `${_status.open ? '-' : ''}"Done",`
    }

    return labels
  }

  const labelsToStatus = (_labels: string): Tasktatus => {
    let status: Tasktatus = {
      open: true,
      in_progress: true,
      done: true
    }

    if (_labels) {
      let label_item = _labels.split(',')
      let label_tmp = [] as string[]
      label_item.forEach(label => {
        if (label == '') return
        if (label[0] == '-') {
          if (label.slice(1) == '"In Progress"') {
            status.in_progress = false
          } else if (label.slice(1) == '"Done"') {
            status.done = false
          }
        } else {
          status.open = false
          label_tmp.push(label)
        }
      })

      if (status.open && label_tmp.length == 0) return status
      status.in_progress = label_tmp.includes('"In Progress"')
      status.done = label_tmp.includes('"Done"')
    }
    return status
  }

  useEffect(() => {
    if (!username || !projectName) return
    const initial = () => {
      setPage(1)
      setTask([])
      setSearch(Q)
      setOrder(qorder || 'desc')
      setStatus(labelsToStatus(labels))
    }

    initial()
    console.log(Task)
    fetchData(Q, labels, qorder, 1)
  }, [username, projectName, Q, labels, qorder])

  useEffect(() => {
    if (!username || !projectName) return
    routerPush(search, statusToLabels(status), order)
  }, [status])

  const routerPush = (q: string, l: string, d: string): void => {
    router.push(
      {
        pathname: `/task/${username}/${projectName}`,
        query: { Q: q, labels: l, qorder: d }
      },
      undefined,
      { shallow: true }
    )
  }

  const updateStatus = (key: keyof Tasktatus): void => {
    setStatus({
      ...status,
      [key]: !status[key]
    })
  }

  return (
    <div
      style={{
        backgroundColor: '#e7ebf0',
        minHeight: '100vh',
        padding: '20px 0'
      }}
    >
      <Container>
        <div
          style={{
            display: 'flex',
          }}
        >
          <IconButton
            onClick={() => router.push('/task')}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <h1>TaskList</h1>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <h2>
            {username} / {projectName}
          </h2>
          <a
            href={`https://github.com/${username}/${projectName}`}
            target="_blank"
            style={{
              marginLeft: 'auto',
              textDecoration: 'none'
            }}
          >
            Go to github
          </a>
        </div>

        <div
          style={{
            display: 'flex',
            height: '36px',
            margin: '20px 0'
          }}
        >
          <ButtonGroup variant="contained">
            <Button
              variant={status.open ? 'contained' : 'outlined'}
              onClick={() => updateStatus('open')}
            >
              Open
            </Button>
            <Button
              variant={status.in_progress ? 'contained' : 'outlined'}
              onClick={() => updateStatus('in_progress')}
            >
              In Progress
            </Button>
            <Button
              variant={status.done ? 'contained' : 'outlined'}
              onClick={() => updateStatus('done')}
            >
              Done
            </Button>
          </ButtonGroup>

          <TextField
            label="Search"
            variant="outlined"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyPress={e => {
              if (e.key == 'Enter') {
                routerPush(search, statusToLabels(status), order)
              }
            }}
            style={{
              margin: '0 20px',
              height: '36px'
            }}
            size="small"
          ></TextField>

          <Button
            variant="contained"
            onClick={() => {
              let d = order == 'desc' ? 'asc' : 'desc'
              setOrder(d)
              routerPush(search, statusToLabels(status), d)
            }}
            style={{
              marginRight: '20px'
            }}
          >
            {order == 'desc' ? 'newest' : 'oldest'}
          </Button>

          <Button variant="contained"> New Task</Button>
        </div>

        <Card
          style={{
            padding: '20px',
          }}
        >
          <InfiniteScroll
            dataLength={Task.length}
            next={() => {
              setPage(page + 1)
              fetchData(search, labels, order, page + 1)
            }}
            hasMore={true}
            loader={null}
          >
            {' '}
            {Task.map((task: any) => {
              return <TaskItem task={task} key={task.id} />
            })}
          </InfiniteScroll>
        </Card>
      </Container>
    </div>
  )
}
