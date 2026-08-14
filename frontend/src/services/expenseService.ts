import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/expenses`;

const getUserId = () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        throw new Error("Kullanıcı girişi bulunamadı.");
    }

    return Number(userId);
};

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        Authorization: `Bearer ${token}`
    };
};

export const getExpenses = async () => {
    const userId = getUserId();

    const response = await axios.get(
        `${API_URL}/user/${userId}`,
        {
            headers: getAuthHeaders()
        }
    );

    return response.data;
};

export const createExpense = async (
    title: string,
    amount: number,
    category: string,
    date: string
) => {
    const userId = getUserId();

    const response = await axios.post(
        `${API_URL}/user/${userId}`,
        {
            title,
            amount,
            category,
            date
        },
        {
            headers: getAuthHeaders()
        }
    );

    return response.data;
};

export const deleteExpense = async (id: number) => {
    const response = await axios.delete(
        `${API_URL}/${id}`,
        {
            headers: getAuthHeaders()
        }
    );

    return response.data;
};

export const updateExpense = async (
    id: number,
    title: string,
    amount: number,
    category: string,
    date: string
) => {
    const response = await axios.put(
        `${API_URL}/${id}`,
        {
            title,
            amount,
            category,
            date
        },
        {
            headers: getAuthHeaders()
        }
    );

    return response.data;
};