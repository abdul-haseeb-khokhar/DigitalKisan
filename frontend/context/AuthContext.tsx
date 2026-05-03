import React, {createContext, useContext, useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from "expo-router"
import { getMe } from '../features/auth/services/authService'
import { useAuth } from '../features/auth/hooks/useAuth'

import {User, LoginPayload, RegisterPayload } from '../features/auth/types/auth.types'  

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null> (null)

export const AuthProvider = ({children} : {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    const [initializing, setInitializing] = useState(true)
    const {login: authLogin, register: authRegister, loading, error} = useAuth()
    const router = useRouter();

    useEffect(() => {
        const restoreSession = async () => {
            try{
                const token = await AsyncStorage.getItem("token");
                if(token) {
                    const me = await getMe()
                    setUser(me)
                }
            } catch {
                await AsyncStorage.multiRemove(['token', 'user'])
            }finally{
                setInitializing(false)
            }
        };
        restoreSession();
    }, []);

    useEffect(()=> {
        if(initializing) return
        if(!user) {
            router.replace("/(auth)/role-select");
            return;
        }
        if(user.role === 'farmer') router.replace("/(farmer)");
        if(user.role === 'buyer') router.replace("/(buyer)");
        if(user.role === 'transporter') router.replace("/(transporter)");
    }, [user, initializing]);

    const login = async (payload: LoginPayload) => {
        const loggedInUser = await authLogin(payload);
        if(loggedInUser) setUser(loggedInUser)
    };

    const register = async (payload: RegisterPayload) => {
        const registeredUser = await authRegister(payload);
        if(registeredUser) setUser(registeredUser)
    };

    const logout = async () => {
        await AsyncStorage.multiRemove(['token', 'user']);
        setUser(null);
    };

    if(initializing) return null;

    return(
        <AuthContext.Provider value={{user, isAuthenticated: !!user, loading, error, login, register, logout}}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error('useAuthContext must be used inside AuthProvider');
    return context
}