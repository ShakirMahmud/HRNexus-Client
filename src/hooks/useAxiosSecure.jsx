import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
    baseURL: 'https://bistro-boss-server-shakir.vercel.app',
})
const useAxiosSecure = () => {
    const {logOut} = useAuth();
    const navigate = useNavigate();
    axiosSecure.interceptors.request.use(
        config => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );
    axiosSecure.interceptors.response.use(
        response => response,
        async error => {
            const status = error.response.status;
            if(status === 401 || status === 403){
                await logOut();
                navigate('/login');
            }
            return Promise.reject(error);
        }
    );
    return axiosSecure;
};

export default useAxiosSecure;