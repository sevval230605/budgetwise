import axios from "axios";

const API_URL = "http://localhost:8080/expenses";

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
// KULLANICIYA AİT GİDERLERİ GETİR
// =========================

export const getExpenses = async () => {
  const userId = getUserId();

  const response = await axios.get(
    `${API_URL}/user/${userId}`
  );

  return response.data;
};

// =========================
// YENİ GİDER EKLE
// =========================

export const createExpense = async (
  title: string,
  amount: number,
  category: string,
  date: string
) => {
  const userId = getUserId();

  const expense = {
    title: title,
    amount: amount,
    category: category,
    date: date,
  };

  const response = await axios.post(
    `${API_URL}/user/${userId}`,
    expense
  );

  return response.data;
};

// =========================
// GİDER SİL
// =========================

export const deleteExpense = async (
  id: number
) => {
  const response = await axios.delete(
    `${API_URL}/${id}`
  );

  return response.data;
};

// =========================
// GİDER GÜNCELLE
// =========================

export const updateExpense = async (
  id: number,
  title: string,
  amount: number,
  category: string,
  date: string
) => {
  const expense = {
    title: title,
    amount: amount,
    category: category,
    date: date,
  };

  const response = await axios.put(
    `${API_URL}/${id}`,
    expense
  );

  return response.data;
};