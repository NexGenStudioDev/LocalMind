import React, { useState } from 'react'
import MainLoader from '../features/Dashboard/V1/Component/Loader/MainLoader'
import Navbar from '../shared/component/v1/Navbar'
import AppRoutes from './routes/AppRoutes'

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
    </>
  )
}

export default App
