import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import PdfEditPage from './pages/PdfEditPage'
import PdfToolsLandingPage from './pages/PdfCombinerPage'
import AboutPage from './pages/AboutPage'
import ConverterPage from './pages/ConverterPage'
import NavBar from './NavBar'
import HomePage from './pages/HomePage'

function App() {
  return (
    <BrowserRouter>
      <div className='h-[100vh]'>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/combine" element={<PdfToolsLandingPage />} />
          <Route path="/editfile" element={<PdfEditPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/convert" element={<ConverterPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
