import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider , createBrowserRouter } from 'react-router-dom'
import Createtrip from './create-trip'
import Header from './components/custom/Header'


const router=createBrowserRouter([
  {
    path:'/',
    element:<App/>
  },
  {
    path:'/create-trip',
    element:<Createtrip/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
 <Header/>
    <RouterProvider router={router}/>
  </StrictMode>,
)
