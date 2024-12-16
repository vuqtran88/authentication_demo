'use client';

import { useAuth } from "../../_api/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {

  const {login, logout, getMe, register} = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onClichHandler = async () => {

    if (await login(email, password)){
      router.push('/home');
    }
  }
  
  return (
    <div className="landing">
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" placeholder="email address" value={email} onChange={(e) => setEmail(e.target.value)}/>
      <label htmlFor="password">Password</label>
      <input type="text" id="password" name="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      <button className="loginButton" onClick={onClichHandler}>Login</button>
      <Link href={"/register"}>or Register.</Link>
    </div>
  );
}
