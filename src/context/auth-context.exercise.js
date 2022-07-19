import React from 'react'
import {createContext, useContext} from 'react'
import * as auth from 'auth-provider'
import {client} from 'utils/api-client'
import {useAsync} from 'utils/hooks'
import {FullPageSpinner, FullPageErrorFallback} from 'components/lib'

async function getUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }

  return user
}

const AuthContext = createContext()
AuthContext.displayName = 'AuthContext'

function useAuth() {
  const authContext = useContext(AuthContext)
  if (!authContext) {
    throw new Error(`authContext must be used within authContext.provider`)
  }
  return authContext
}

function AuthProvider(props) {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => {
    auth.logout()
    setData(null)
  }

  React.useEffect(() => {
    run(getUser())
  }, [run])
  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  if (isSuccess) {
    const value = {user, login, register, logout}
    return <AuthContext.Provider value={value} {...props} />
  }
}

function useClient() {
  const token = useAuth().user.token
  return React.useCallback(
    function authenticatedClient(endpoint, config) {
      return client(endpoint, {...config, token})
    },
    [token],
  )
}

export {AuthProvider, useAuth, useClient}
