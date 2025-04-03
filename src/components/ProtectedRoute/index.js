import React from 'react'
import Cookie from 'js-cookie'
import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoute = () => {
    const jwtToken = Cookie.get('jwtToken')
    return jwtToken ? <Outlet /> : <Navigate to='/login' />
}

export default ProtectedRoute