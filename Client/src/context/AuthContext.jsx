// JWT login context
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import axios from '../api/axiosInstance'
import { API_ROUTES } from '../api/apiRoutes'

export const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('sb_token')
    const storedUser = localStorage.getItem('sb_user')
    if (storedToken) setToken(storedToken)
    if (storedUser) setUser(JSON.parse(storedUser))
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await axios.post(API_ROUTES.AUTH.LOGIN, { email, password })
    const nextToken = data?.token
    const nextUser = data?.user
    if (nextToken) {
      localStorage.setItem('sb_token', nextToken)
      setToken(nextToken)
    }
    if (nextUser) {
      localStorage.setItem('sb_user', JSON.stringify(nextUser))
      setUser(nextUser)
    }
    return data
  }, [])

  const register = useCallback(async (payload) => {
    const { data } = await axios.post(API_ROUTES.AUTH.REGISTER, payload)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('sb_token')
    localStorage.removeItem('sb_user')
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, token, loading, login, register, logout, isAuthenticated: Boolean(token) }), [user, token, loading, login, register, logout])

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}


