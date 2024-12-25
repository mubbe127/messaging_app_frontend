import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx"


import './App.css'

function App() {



const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
 
  },
  {
    path:"/home",
    element: <Home/>
  }
  
]);
  
  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App
