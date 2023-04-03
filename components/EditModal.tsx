import { useState, useEffect } from 'react'
import { Modal, Box, TextField, Button } from '@mui/material'

import type { Task } from '@/api'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 400,
  bgcolor: 'background.paper',
  boxShadow: 4,
  p: 2
}

export default function EditModal({
  open,
  task,
  saveHandler,
  closeHandler
}: {
  open: boolean
  task: Task,
  saveHandler: (task: Task) => void
  closeHandler: () => void
}) {
  const [title, setTitle] = useState(task.title)
  const [body, setBody] = useState(task.body)
  const [titleError, setTitleError] = useState(false)
  const [bodyError, setBodyError] = useState(false)

  const validateHandler = () : void => {
    if (title.length == 0) {
      setTitleError(true)
      return
    }

    if (body.length < 30) {
      setBodyError(true)
      return
    }

    saveHandler({
      title,
      body
    })
  }

  useEffect(() => {
    setTitle(task.title)
    setBody(task.body)
  }, [task])

  return (
    <Modal
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={open}
      onClose={closeHandler}
    >
      <Box sx={style}>
        <TextField
          error={titleError}
          helperText={titleError ? 'Title is required' : ''}
          required
          label="Title"
          defaultValue={title}
          fullWidth
          onChange={e => setTitle(e.target.value)}
        />
        <TextField
          error={bodyError}
          helperText={bodyError ? 'Body must over 30 words' : ''}
          required
          label="Body"
          defaultValue={body}
          multiline
          fullWidth
          rows={8}
          margin="normal"
          onChange={e => setBody(e.target.value)}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '5px',
            right: '10px',
          }}
        >
          <Button color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={validateHandler}
          >
            Save
          </Button>
        </div>
      </Box>
    </Modal>
  )
}
