import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URLS = {
    user: `http://${process.env.EXPO_PUBLIC_IP}:5001/api`,
    listing: `http://${process.env.EXPO_PUBLIC_IP}:5002/api`,
    order: `http://${process.env.EXPO_PUBLIC_IP}:5003/api`,
    payment: `http://${process.env.EXPO_PUBLIC_IP}:5004/api`,
    transport: `http://${process.env.EXPO_PUBLIC_IP}:5005/api`,
    notify: `http://${process.env.EXPO_PUBLIC_IP}:5006/api`,
    admin: `http://${process.env.EXPO_PUBLIC_IP}:5007/api`,
}

const createClient = (baseURL: string) => {
    const client = axios.create({baseURL});
    client.interceptors.request.use(async (config) => {
        const token = await AsyncStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    client.interceptors.response.use(
        (response) => response,
        (error) => {
            console.log(error.message)
            const message = error.response?.data?.message || "Something went wrong";
            console.log(message)
            return Promise.reject(new Error(message));
        }
    );

    return client;
};

export const userClient = createClient(BASE_URLS.user);
export const listingClient = createClient(BASE_URLS.listing);
export const orderClient = createClient(BASE_URLS.order);
export const paymentClient = createClient(BASE_URLS.payment);
export const transportClient = createClient(BASE_URLS.transport);
export const notifyClient = createClient(BASE_URLS.notify);
export const adminClient = createClient(BASE_URLS.admin);
