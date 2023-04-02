import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { isColorDark } from '@/utils'

import {
  Container,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography
} from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

async function getRepoIssueDetail(
  owner: string,
  projectName: string,
  issueNumber: string
): Promise<Object[]> {
  const token = window.sessionStorage.getItem('token')

  try {
    const res = await fetch(
      `/api/repos/${owner}/${projectName}/issues/${issueNumber}`,
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
    return data
  } catch (err) {
    throw err
  }
}

export default function TaskDetail() {
  const router = useRouter()
  const { username, projectName, issueNumber } = router.query as {
    username: string
    projectName: string
    issueNumber: string
  }

  const [task, setTask] = useState({} as any)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (!username || !projectName || !issueNumber) return
    getRepoIssueDetail(username, projectName, issueNumber)
      .then(data => {
        setTask(data)
      })
      .catch(err => {
        console.error(err)
      })
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
          {username} / {projectName} #{issueNumber}{' '}
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
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
              </div>
              <Menu
                id="menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  Edit
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <Typography color="error">Delete</Typography>
                </MenuItem>
              </Menu>
              <p
                style={{
                  color: '#666'
                }}
              >
                {task.body}
              </p>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}
