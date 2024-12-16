'use client';

import { useAuth } from '@/app/_api/auth';
import Link from 'next/link';
import React from 'react'

const Home = () => {

    const { user } = useAuth();
    console.log("user", user);
    const loggedIn = user !== null;
    
  return (
    <div className=''>
        {loggedIn ? (
            <div>
                <h3>Home</h3>
                <p>Welcome to the home page {user.firstName} {user.lastName}</p>
                <p><Link href={"/logout"}>Log out</Link></p>
            </div>    
        ) : (
            <div>
                <h1>Home</h1>
                <p>You are not logged in yet. Please <Link href={"/login"}>log in!</Link></p>
            </div>
        )}
    </div>
  )
}

export default Home