import React from 'react'
import { Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div>
       <Outlet/>
       <Toaster position="top-center" reverseOrder={false} />
    </div>
  )
}

export default App