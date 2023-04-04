interface Task {
  title: string
  body: string
}

async function requestApi(endpoint: string, options: any, ok: number = 200) {
  const token = window.sessionStorage.getItem('token')

  const headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  })

  const defaults = { headers: headers }
  options = { ...defaults, ...options}

  const res = await fetch(endpoint, options)

  if (res.status != ok) {
    throw Error(`${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  return data
}

async function updateTask(
  owner: string,
  projectName: string,
  issueNumber: string,
  task: Task
): Promise<void> {
  const endpoint = `/api/repos/${owner}/${projectName}/issues/${issueNumber}`
  const options = {
    method: 'POST',
    body: JSON.stringify(task)
  }

  try {
    await requestApi(endpoint, options)
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
  const endpoint = `/api/repos/${owner}/${projectName}/issues/${issueNumber}/labels`
  const options = {
    method: 'PUT',
    body: JSON.stringify({
      labels: labels
    })
  }

  try {
    await requestApi(endpoint, options)
  } catch (err) {
    throw err
  }
}

async function createTask(
  owner: string,
  projectName: string,
  task: Task
): Promise<void> {
  const endpoint = `/api/repos/${owner}/${projectName}/issues`
  const options = {
    method: 'POST',
    body: JSON.stringify(task)
  }

  try {
    await requestApi(endpoint, options, 201)
  } catch (err) {
    throw err
  }
}

async function deleteTask(
  owner: string,
  projectName: string,
  issueNumber: string
): Promise<void> {
  const endpoint = `/api/repos/${owner}/${projectName}/issues/${issueNumber}`
  const options = {
    method: 'POST',
    body: JSON.stringify({ state: 'closed' })
  }

  try {
    await requestApi(endpoint, options)
  } catch (err) {
    throw err
  }
}

async function getRepoTaskDetail(
  owner: string,
  projectName: string,
  issueNumber: string
): Promise<Object[]> {
  const endpoint = `/api/repos/${owner}/${projectName}/issues/${issueNumber}`
  const options = {
    method: 'GET'
  }

  try {
    return await requestApi(endpoint, options)
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

  const endpoint = `/api/search/issues?q=${q}&sort=created&order=${order}&per_page=10&page=${page}`
  const options = {
    method: 'GET'
  }

  try {
    return await requestApi(endpoint, options)
  } catch (err) {
    throw err
  }
}

async function getRepos(): Promise<any> {
  const endpoint = `/api/user/repos?sort=updated`
  const options = {
    method: 'GET'
  }

  try {
    return await requestApi(endpoint, options)
  } catch (err) {
    throw err
  }
}

async function Login(code: string): Promise<string> {
  try {
    const res = await fetch(
      `/github/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`,
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
