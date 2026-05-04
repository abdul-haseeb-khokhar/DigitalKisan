import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, registerUser } from "../services/authService";
import { LoginPayload, RegisterPayload, User } from "../types/auth.types";

export const useAuth = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const login = async (payload: LoginPayload): Promise<User | null> => {
        setLoading(true)
        setError(null)

        try{
            const data = await loginUser(payload)
            await AsyncStorage.setItem('token', data.token)
            await AsyncStorage.setItem('user', JSON.stringify(data.user))
            return data.user
        } catch(err: any){
            setError(err.message)
            return null
        } finally {
            setLoading(false);
        }
    };

    const register = async(payload: RegisterPayload): Promise<User |null> => {
        console.log('register function of useAuth is called')
        setLoading(true)
        setError(null)
        try{
            const data = await registerUser(payload)
            await AsyncStorage.setItem("token", data.token)
            await AsyncStorage.setItem("user", JSON.stringify(data.user))
            return data.user
        } catch (err : any) {
            setError(err.message)
            return null
        } finally {
            setLoading(false)
        }
    };

    return {login, register, loading, error}
}