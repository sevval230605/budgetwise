import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/incomes`;

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

export const getIncomes = async () => {
    const userId = getUserId();

    const response = await axios.get(
        `${API_URL}/user/${userId}`,
        {
            headers: getAuthHeaders()
        }
    );

    return response.data;
};

export const createIncome = async (
    title: string,
    amount: number,
    date: string
) => {
    const userId = getUserId();

    const response = await axios.post(
        `${API_URL}/user/${userId}`,
        {
            title,
            amount,
            date
        },
        {
            headers: getAuthHeaders()
        }
    );

    return response.data;
};

export const deleteIncome = async (id: number) => {
    const response = await axios.delete(
        `${API_URL}/${id}`,
        {
            headers: getAuthHeaders()
        }
    );

    return response.data;
};

export const updateIncome = async (
    id: number,
    title: string,
    amount: number,
    date: string
) => {
    const response = await axios.put(
        `${API_URL}/${id}`,
        {
            title,
            amount,
            date
        },
        {
            headers: getAuthHeaders()
        }
    );

    return response.data;
};