import React from 'react'
import CreateAdmin from '../components/CreateAdminForm'
import LogOut from '../authentication/logout/page'

const page = () => {
    
  return (
    <>
    <div className=''>
      <LogOut/>
      <CreateAdmin/>
    </div>

    <div className='bg-green-700'>
        Edit User
    </div>
    </>
  )
}

export default page
