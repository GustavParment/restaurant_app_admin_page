"use client"

import React from 'react'
import SignIn from './authentication/SignIn'
import { useRouter } from 'next/navigation'

const page = () => {

  const router = useRouter()

  const navigateToLogin = () =>{
    router.push("/authentication/login")

  }
  return (
    <div className='flex justify-center items-center'>
      <button className='bg-slate-400'
      onClick={navigateToLogin}
      >Click here to login Admin</button>
    </div>
  )
}

export default page
