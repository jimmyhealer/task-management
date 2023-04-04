import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

import { isColorDark } from '@/utils'
import { Task, getRepoTask, createTask } from '@/api'
import EditModal from '@/components/EditModal'

import InfiniteScroll from 'react-infinite-scroll-component'
import {
  Container,
  TextField,
  Button,
  ButtonGroup,
  Card,
  Typography,
  IconButton
} from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

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
              fontSize: '1.5rem'
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

interface Tasktatus {
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
  const [modalOpen, setModalOpen] = useState(false)

  const fetchData = (
    _search: string,
    _labels: string,
    _order: string,
    _page: number
  ): void => {
    getRepoTask(username, projectName, _search, _labels, _order, _page)
      .then((data: any) => {
        const tasks = data.items
        if (_page == 1) {
          setTask(tasks)
        } else {
          setTask(prevTask => [...prevTask, ...tasks])
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

  const saveHandler = (task: Task): void => {
    createTask(username, projectName, task)
      .then(() => {
        setModalOpen(false)
        setPage(1)
        fetchData(Q, labels, qorder, 1)
      })
      .catch(err => {
        console.error(err)
      })
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
            display: 'flex'
          }}
        >
          <IconButton onClick={() => router.push('/task')}>
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
              marginLeft: 'auto'
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

          <Button variant="contained" onClick={() => setModalOpen(true)}>
            New Task
          </Button>
          <EditModal
            open={modalOpen}
            task={{
              title: '',
              body: ''
            }}
            closeHandler={() => {
              setModalOpen(false)
            }}
            saveHandler={saveHandler}
          />
        </div>

        <Card
          style={{
            padding: '20px'
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
            {Task.map((task: any) => {
              return <TaskItem task={task} key={task.id} />
            })}
          </InfiniteScroll>
        </Card>
      </Container>
    </div>
  )
}
