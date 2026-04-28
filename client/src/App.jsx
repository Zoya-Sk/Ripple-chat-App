import React, { useEffect } from 'react'
import Signup from './pages/Signup'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import { useSelector, useDispatch } from 'react-redux'
import io from "socket.io-client"
import { setSocket, setAllOnlineUsers } from './redux/slices/Socket'

const App = () => {
  const { token } = useSelector((state) => state.auth);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const router = createBrowserRouter([
    { path: "/", element: token ? <Home /> : <Signup /> },
    { path: "/login", element: token ? <Navigate to="/home" /> : <Login /> },
    { path: "/home", element: token ? <Home /> : <Navigate to="/login" /> },
  ])

  useEffect(()=>{
    if(!token || !userData?._id){
      return ;
    }
    const socket = io(`${import.meta.env.VITE_SOCKET_URL}`,{
      query:{
        userId:userData?._id,
      }
    });

    dispatch(setSocket(socket));

    socket.on("send-all-online-users",(data)=>{
      dispatch(setAllOnlineUsers(data));
    })

    return ()=>{
      socket.off("send-all-online-users");
      socket.disconnect();
    }
  
  },[token])

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  )
}

export default App