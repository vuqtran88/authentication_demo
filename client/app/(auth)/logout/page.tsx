'use client';

import { useAuth } from '@/app/_api/auth'
import Link from 'next/link'
import React from 'react'

const Logout = () => {

    const authContext = useAuth();

    authContext.logout();

  return (
    <div>
        <p>You have logged out. <Link href={"/login"}>Log in</Link> again.</p>
    </div>
  )
}

export default Logout