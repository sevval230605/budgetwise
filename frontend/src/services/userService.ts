import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/users`;
export const getUser = async (id: number) => {
    const response = await axios.get(
        `${API_URL}/${id}`
    );

    return response.data;
};

export const registerUser = async (
    email: string,
    password: string
) => {
    const response = await axios.post(
        `${API_URL}/register`,
        {
            email,
            password
        }
    );

    return response.data;
};

export const loginUser = async (
    email: string,
    password: string
) => {
    const response = await axios.post(
        `${API_URL}/login`,
        {
            email,
            password
        }
    );

    return response.data;
};