import { useState } from 'react'
import { BrowserRouter, Route , Routes } from 'react-router-dom'
import { Home } from './component/pages/Home'
import { Courses } from './component/pages/Courses'
import { Detail } from './component/pages/Detail'
import { Login } from './component/pages/Login'
import { Register } from './component/pages/Register'
import { MyCourses } from './component/pages/account/MyCourses'
import { CoursesEnrolled } from './component/pages/account/CoursesEnrolled'
import { WatchCourse } from './component/pages/account/WatchCourse'
import { ChangePassword } from './component/pages/account/ChangePassword'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/courses' element={<Courses/>} />
            <Route path='/detail' element={<Detail/>} />
            <Route path='/account/login' element={<Login/>} />
            <Route path='/account/register' element={<Register/>} />
            <Route path='/account/my-courses' element={<MyCourses/>} />
            <Route path='/account/courses-enrolled' element={<CoursesEnrolled/>} />
            <Route path='/account/watch-courses' element={<WatchCourse/>} /> 
            <Route path='/account/change-password' element={<ChangePassword/>} />      
        </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
