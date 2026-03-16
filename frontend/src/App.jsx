import { useState } from 'react'
import { BrowserRouter, Route , Routes } from 'react-router-dom'
import { Home } from './component/pages/Home'
import { Courses } from './component/pages/Courses'
import { Detail } from './component/pages/Detail'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/courses' element={<Courses/>} />
            <Route path='/detail' element={<Detail/>} />
        </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
