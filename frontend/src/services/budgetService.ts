import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/budgets`;

const getUserId = (): number => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        throw new Error("Kullanıcı girişi bulunamadı.");
    }

    return Number(userId);
};

const getToken = (): string => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Giriş tokenı bulunamadı.");
    }

    return token;
};

// =========================
// BÜTÇEYİ GETİR
// =========================

export const getBudget = async (
    month: string
) => {

    const userId = getUserId();
    const token = getToken();

    const response = await axios.get(
        `${API_URL}/${userId}/${encodeURIComponent(month)}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

// =========================
// BÜTÇE KAYDET
// =========================

export const saveBudget = async (
    month: string,
    amount: number
) => {

    const userId = getUserId();
    const token = getToken();

    const response = await axios.post(
        `${API_URL}/${userId}`,
        null,
        {
            params: {
                month: month,
                amount: amount
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};