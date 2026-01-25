import React, { useState } from 'react'
import MainLoader from '../features/Dashboard/V1/Component/Loader/MainLoader'
import Navbar from '../shared/component/v1/Navbar'
import AppRoutes from './routes/AppRoutes'
import Footer from '../shared/component/v1/Footer'

const App: React.FC = () => {
  const [Loader, setLoader] = useState(true)

  return (
    <>
      {/* Global Loader */}
      {Loader && <MainLoader fn={setLoader} />}

      {/* Main Navbar (always visible unless hidden in route) */}
      <Navbar />

      {/* All application routes including Chat Page */}
      <AppRoutes />

      <Footer />
    </>
  )
}

export default App
