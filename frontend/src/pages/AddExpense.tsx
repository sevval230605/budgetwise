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
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanTitle = title.trim();
        const numericAmount = Number(amount);

        if (!cleanTitle) {
            alert("Lütfen gider başlığı girin.");
            return;
        }

        if (!amount || numericAmount <= 0) {
            alert("Lütfen geçerli bir tutar girin.");
            return;
        }

        if (!category) {
            alert("Lütfen bir kategori seçin.");
            return;
        }

        if (!date) {
            alert("Lütfen tarih seçin.");
            return;
        }

        try {
            setLoading(true);

            await createExpense(
                cleanTitle,
                numericAmount,
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

            alert(
                "Gider eklenirken bir hata oluştu. Lütfen tekrar deneyin."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="money-page">
            <div className="money-card">

                <button
                    type="button"
                    className="money-back-button"
                    onClick={() => navigate("/dashboard")}
                    disabled={loading}
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
                            disabled={loading}
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
                                disabled={loading}
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
                            disabled={loading}
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
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="money-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "⏳ Kaydediliyor..."
                            : "💸 Gideri Kaydet"}
                    </button>

                </form>

            </div>
        </div>
    );
}

export default AddExpense;