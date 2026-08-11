import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createExpense } from "../services/expenseService";
import "../App.css";

function AddExpense() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createExpense(
        title,
        Number(amount),
        category,
        date
      );

      alert("Gider başarıyla eklendi!");

      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Gider eklenirken hata:",
        error
      );

      alert("Gider eklenirken hata oluştu!");
    }
  };

  return (
    <div className="money-page">
      <div className="money-card">

        <button
          className="money-back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <div className="money-icon">
          💸
        </div>

        <h1>Gider Ekle</h1>

        <p className="money-subtitle">
          Harcamalarını kaydederek bütçeni takip et.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="money-input-group">
            <label>Gider Başlığı</label>

            <input
              type="text"
              placeholder="Örneğin: Market"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
            />
          </div>

          <div className="money-input-group">
            <label>Tutar</label>

            <div className="money-input-wrapper">
              <span>₺</span>

              <input
                type="number"
                placeholder="1500"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="money-input-group">
            <label>Kategori</label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              required
            >
              <option value="">
                Kategori seçin
              </option>

              <option value="Yemek">
                🍔 Yemek
              </option>

              <option value="Ulaşım">
                🚗 Ulaşım
              </option>

              <option value="Alışveriş">
                🛍️ Alışveriş
              </option>

              <option value="Fatura">
                🧾 Fatura
              </option>

              <option value="Eğlence">
                🎬 Eğlence
              </option>

              <option value="Sağlık">
                💊 Sağlık
              </option>

              <option value="Diğer">
                📦 Diğer
              </option>
            </select>
          </div>

          <div className="money-input-group">
            <label>Tarih</label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="money-submit"
          >
            💸 Gideri Kaydet
          </button>

        </form>

      </div>
    </div>
  );
}

export default AddExpense;