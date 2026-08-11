import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/incomes`;
// =========================
// GİRİŞ YAPAN KULLANICIYI AL
// =========================

const getUserId = () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        throw new Error("Kullanıcı girişi bulunamadı.");
    }

    return Number(userId);
};

// =========================
// KULLANICIYA AİT GELİRLERİ GETİR
// =========================

export const getIncomes = async () => {
    const userId = getUserId();

    const response = await axios.get(
        `${API_URL}/user/${userId}`
    );

    return response.data;
};

// =========================
// YENİ GELİR EKLE
// =========================

export const createIncome = async (
    title: string,
    amount: number,
    date: string
) => {
    const userId = getUserId();

    const income = {
        title: title,
        amount: amount,
        date: date,
    };

    const response = await axios.post(
        `${API_URL}/user/${userId}`,
        income
    );

    return response.data;
};

// =========================
// GELİR SİL
// =========================

export const deleteIncome = async (id: number) => {
    const response = await axios.delete(
        `${API_URL}/${id}`
    );

    return response.data;
};

// =========================
// GELİR GÜNCELLE
// =========================

export const updateIncome = async (
    id: number,
    title: string,
    amount: number,
    date: string
) => {
    const income = {
        title: title,
        amount: amount,
        date: date,
    };

    const response = await axios.put(
        `${API_URL}/${id}`,
        income
    );

    return response.data;
};