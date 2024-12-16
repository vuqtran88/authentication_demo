'use client';
import { ReactNode, useContext, useState } from "react";
import cookies from 'js-cookie';
import React from "react";

export type User = {
    email: string;
    password: string;
    userName: string;
    firstName: string;
    lastName: string
}

export type AuthContext = {
    login: (email: string, password: string) => Promise<any>;
    logout: () => Promise<any>;
    getMe: () => Promise<any>;
    register: (user: User) => Promise<any>;
    user: User | null;
};

const defaultAuthContext: AuthContext = {
    login: async () => {
        throw new Error('AuthContext not provided');
    },
    logout: async () => {
        throw new Error('AuthContext not provided');
    },
    getMe: async () => {
        throw new Error('AuthContext not provided');
    },
    register: async () => {
        throw new Error('AuthContext not provided');
    },
    user: null,
};

const Context = React.createContext<AuthContext>(defaultAuthContext);

export const AuthProvider = ({ children } : { children: ReactNode}) => {
    const [user, setUser] = useState(null);

    const authApiUrl = `${process.env.AUTH_SERVER_URL}/api/auth/users`;

    const login = async (email: string, password: string) => {
        console.log(authApiUrl);

        const response = await fetch(`${authApiUrl}/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (response.status !== 200) {
            return null;
        }

        const newUser = await response.json() 

        setUser(newUser);

        return newUser;
    };

    const register = async (user: User) => {
        const response = await fetch(`${authApiUrl}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...user }),
        });

        return response.json();
    }

    const logout = async () => {
        cookies.remove('token');
        return { success: true };
    }

    const getMe = async () => {
        
        const response = await fetch(`${authApiUrl}/me`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
        });

        if (response.status === 200) {
            const newUser = await response.json() 
            setUser(newUser);
            return newUser;
        }

        console.log(response.json());
        return null;
    }

    return <Context.Provider value={{login, logout, getMe, register, user}}>{children}</Context.Provider>;
};

export const useAuth = () => {
    return useContext(Context);
};