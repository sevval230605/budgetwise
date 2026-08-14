import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createIncome } from "../services/incomeService";
import "../App.css";

function AddIncome() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanTitle = title.trim();
        const numericAmount = Number(amount);

        if (!cleanTitle) {
            alert("Lütfen gelir başlığı girin.");
            return;
        }

        if (!amount || numericAmount <= 0) {
            alert("Lütfen geçerli bir tutar girin.");
            return;
        }

        if (!date) {
            alert("Lütfen tarih seçin.");
            return;
        }

        try {
            setLoading(true);

            await createIncome(
                cleanTitle,
                numericAmount,
                date
            );

            alert("Gelir başarıyla eklendi!");

            setTitle("");
            setAmount("");
            setDate("");

            navigate("/dashboard");

        } catch (error) {
            console.error(
                "Gelir eklenirken hata:",
                error
            );

            alert(
                "Gelir eklenirken bir hata oluştu. Lütfen tekrar deneyin."
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
                    💰
                </div>

                <h1>Gelir Ekle</h1>

                <p className="money-subtitle">
                    Gelir bilgilerini girerek bütçene ekle.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="money-input-group">
                        <label>Gelir Başlığı</label>

                        <input
                            type="text"
                            placeholder="Örneğin: Maaş"
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
                                placeholder="15000"
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
                            : "💰 Geliri Kaydet"}
                    </button>

                </form>

            </div>
        </div>
    );
}

export default AddIncome;