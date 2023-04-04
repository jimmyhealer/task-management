import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'

import { isColorDark } from '@/utils'
import EditModal from '@/components/EditModal'
import type { Task } from '@/api'
import { getRepoTaskDetail, updateTask, deleteTask, setTaskLabels } from '@/api'
import WithAuth from '@/hoc/withAuth'

import {
  Container,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio
} from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const TaskDetail = () => {
  const router = useRouter()
  const { username, projectName, issueNumber } = router.query as {
    username: string
    projectName: string
    issueNumber: string
  }

  const [task, setTask] = useState({} as any)
  const [taskStatus, setTaskStatus] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)
  const menu_open = Boolean(anchorEl)
  const [modal_open, setModalOpen] = useState(false)

  enum STATUS {
    OPEN,
    IN_PROGRESS,
    DONE
  }

  const fetchData = (): void => {
    getRepoTaskDetail(username, projectName, issueNumber)
      .then(data => {
        setTask(data)
        setTaskStatus(getTaskStatus(data))
      })
      .catch(err => {
        console.error(err)
      })
  }

  const getTaskStatus = (task: any): STATUS => {
    if (!task.labels) return STATUS.OPEN

    let labels = task.labels as any[]
    let status = labels.filter((label: any) => {
      return label.name == 'In Progress' || label.name == 'Done'
    })

    if (status.length == 0) {
      return STATUS.OPEN
    } else if (status[0].name == 'In Progress') {
      return STATUS.IN_PROGRESS
    } else {
      return STATUS.DONE
    }
  }

  const handleMenuClick = (event: any): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = (): void => {
    setAnchorEl(null)
  }

  const saveHandler = (task: Task): void => {
    updateTask(username, projectName, issueNumber, task)
      .then(() => {
        setModalOpen(false)
        fetchData()
      })
      .catch(err => {
        console.error(err)
      })
  }

  const deleteHandler = (): void => {
    deleteTask(username, projectName, issueNumber)
      .then(() => {
        router.push(`/task/${username}/${projectName}`)
      })
      .catch(err => {
        console.error(err)
      })
  }

  const statusHandler = (
    e: ChangeEvent<HTMLInputElement>,
    status: string | number
  ): void => {
    let labels = task.labels as Object[]
    if (labels.length > 0) {
      labels = labels.filter((label: any) => {
        return (
          label.name !== 'Open' &&
          label.name !== 'In Progress' &&
          label.name !== 'Done'
        )
      })
    }

    let new_labels: string[] = []

    labels.forEach((label: any) => {
      new_labels.push(label.name)
    })

    status = parseInt(status as string, 10)

    switch (status) {
      case STATUS.IN_PROGRESS:
        new_labels.push('In Progress')
        break
      case STATUS.DONE:
        new_labels.push('Done')
        break
      default:
        break
    }

    setTaskLabels(username, projectName, issueNumber, new_labels)
      .then(() => {
        setTaskStatus(status as number)
        // fetchData()
      })
      .catch(err => {
        console.error(err)
      })
  }

  useEffect(() => {
    if (!username || !projectName || !issueNumber) return
    fetchData()
  }, [username, projectName, issueNumber])

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
          <IconButton
            onClick={() => router.push(`/task/${username}/${projectName}`)}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <h1>TaskDetail</h1>
        </div>
        <p
          style={{
            padding: '10px 0',
            fontSize: '1.2rem'
          }}
        >
          {username} / {projectName} #{issueNumber}
        </p>
        <div>
          {task.labels &&
            task.labels.map((label: any) => (
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
        </div>
        <Card
          style={{
            marginTop: '20px'
          }}
        >
          <CardContent>
            <div>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="status"
                  name="status"
                  value={taskStatus}
                  onChange={statusHandler}
                  row
                >
                  <FormControlLabel
                    value={STATUS.OPEN}
                    control={<Radio />}
                    label="Open"
                  />
                  <FormControlLabel
                    value={STATUS.IN_PROGRESS}
                    control={<Radio />}
                    label="In Progress"
                  />
                  <FormControlLabel
                    value={STATUS.DONE}
                    control={<Radio />}
                    label="Done"
                  />
                </RadioGroup>
              </FormControl>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <h3
                  style={{
                    fontSize: '1.5rem',
                    marginBottom: '10px'
                  }}
                >
                  {task.title}
                </h3>
                <IconButton
                  aria-label="more"
                  aria-controls="menu"
                  aria-haspopup="true"
                  onClick={handleMenuClick}
                >
                  <MoreVertIcon />
                </IconButton>
              </div>
              <Menu
                id="menu"
                anchorEl={anchorEl}
                open={menu_open}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    setModalOpen(true)
                    handleMenuClose()
                  }}
                >
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  Edit
                </MenuItem>
                <MenuItem onClick={deleteHandler}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <Typography color="error">Delete</Typography>
                </MenuItem>
              </Menu>
              <Typography
                variant="body1"
                color={'#666'}
                style={{ whiteSpace: 'pre-line' }}
                paragraph
              >
                {task.body}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Container>
      <EditModal
        open={modal_open}
        task={task}
        saveHandler={saveHandler}
        closeHandler={() => {
          setModalOpen(false)
        }}
      ></EditModal>
    </div>
  )
}

export default WithAuth(TaskDetail)