import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URLS = {
    user: `https://${process.env.EXPO_PUBLIC_IP}:5001/api`,
    listing: `https://${process.env.EXPO_PUBLIC_IP}:5002/api`,
    order: `https://${process.env.EXPO_PUBLIC_IP}:5003/api`,
    payment: `https://${process.env.EXPO_PUBLIC_IP}:5004/api`,
    transport: `https://${process.env.EXPO_PUBLIC_IP}:5005/api`,
    notify: `https://${process.env.EXPO_PUBLIC_IP}:5006/api`,
    admin: `https://${process.env.EXPO_PUBLIC_IP}:5007/api`,
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
            const message = error.response?.data?.message || "Something went wrong";
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
