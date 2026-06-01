import React, { useEffect } from 'react'
import './App.css'
import { RouterProvider } from 'react-router';
import { router } from './app.routes.jsx';
import { useAuth } from '../features/auth/hook/useAuth.js';
import { useSelector } from 'react-redux';
const App = () => {
  const { handleGetMe } = useAuth();
  useEffect(() => {
    handleGetMe();
  }, [])
  
  return (
    <>
      <RouterProvider router = {router} />
    </>
  )
}

export default App