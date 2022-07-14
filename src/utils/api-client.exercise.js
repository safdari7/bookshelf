import * as auth from 'auth-provider'
const apiURL = process.env.REACT_APP_API_URL

function client(
  endpoint,
  {token, headers: customHeaders, data, ...customConfig} = {},
) {
  const config = {
    method: data ? 'POST' : 'GET',
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    body: data ? JSON.stringify(data) : undefined,
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    if (response.status === 401) {
      await auth.logout()
      window.location.assign(window.location)
      return Promise.reject({message: 'please re-authenticate'})
    }
    const data = await response.json()
    if (response.ok) {
      console.log(response)
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {client}
