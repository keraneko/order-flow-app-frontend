import { BrowserRouter, Routes, Route,Link } from 'react-router'
import Home from './pages/Home'
import Orders from './pages/Orders'
import {Button} from './components/ui/button.tsx'
import './App.css'
function App() {

  return (
    <>
      <BrowserRouter>
      <nav className="flex gap-4 p-4 list-none ">
        <li><Link to="/"><Button className="text-blue-600" variant="default">Home</Button></Link></li>
        <li><Link to="/orders"><Button className="text-blue-600" >Orders</Button></Link></li>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orders" element={<Orders />} />

      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
