interface Task {
  title: string
  body: string
}

async function updateTask(
  owner: string,
  projectName: string,
  issueNumber: string,
  task: Task
  ): Promise<void> {
  const token = window.sessionStorage.getItem('token')

  try {
    const res = await fetch(
      `/api/repos/${owner}/${projectName}/issues/${issueNumber}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(task)
      }
    )
    if (res.status != 200) {
      throw Error(`${res.status} ${res.statusText}`)
    }
  } catch (err) {
    throw err
  }
}

async function setTaskLabels(
  owner: string,
  projectName: string,
  issueNumber: string,
  labels: string[]
): Promise<void> {
  const token = window.sessionStorage.getItem('token')

  try {
    const res = await fetch(
      `/api/repos/${owner}/${projectName}/issues/${issueNumber}/labels`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          labels: labels
        })
      }
    )
    if (res.status != 200) {
      throw Error(`${res.status} ${res.statusText}`)
    }
  } catch (err) {
    throw err
  }
}

async function createTask(
  owner: string,
  projectName: string,
  task: Task
): Promise<void> {
  const token = window.sessionStorage.getItem('token')

  try {
    const res = await fetch(`/api/repos/${owner}/${projectName}/issues`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(task)
    })
    if (res.status != 201) {
      throw Error(`${res.status} ${res.statusText}`)
    }
  } catch (err) {
    throw err
  }
}

async function deleteTask(
  owner: string,
  projectName: string,
  issueNumber: string
): Promise<void> {
  const token = window.sessionStorage.getItem('token')

  try {
    const res = await fetch(
      `/api/repos/${owner}/${projectName}/issues/${issueNumber}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ state: 'closed' })
      }
    )
    if (res.status != 200) {
      throw Error(`${res.status} ${res.statusText}`)
    }
  } catch (err) {
    throw err
  }
}

async function getRepoTaskDetail(
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
    let q = `in:issue state:open repo:${owner}/${projectName}`

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

async function getRepos(): Promise<any> {
  const token = window.sessionStorage.getItem('token')

  try {
    const res = await fetch('/api/user/repos?sort=updated', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function Login(code: string): Promise<string> {
  try {
    const res = await fetch(
      `/github/login/oauth/access_token?client_id=24260c7de28ce45f53b5&client_secret=${process.env.CLIENT_SECRET}&code=${code}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    const data = await res.json()
    return data.access_token
  } catch (err) {
    console.error(err)
    throw err
  }
}

export type { Task }

export {
  updateTask,
  createTask,
  deleteTask,
  setTaskLabels,
  getRepoTaskDetail,
  getRepoTask,
  getRepos,
  Login
}
