import React from 'react'
import ProtectedRoutes from '../ProtectedRoutes'

const Page = () => {
  return (
    <ProtectedRoutes>
      <div>Page</div>
    </ProtectedRoutes>
  )
}

export default Page