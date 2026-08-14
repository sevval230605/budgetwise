import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../services/userService";
import "../App.css";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const cleanEmail = email.trim();

        if (!cleanEmail) {
            alert("Lütfen e-posta adresinizi girin.");
            return;
        }

        if (!password) {
            alert("Lütfen şifrenizi girin.");
            return;
        }

        if (password.length < 6) {
            alert(
                "Şifre en az 6 karakter olmalıdır."
            );
            return;
        }

        try {
            setLoading(true);

            await registerUser(
                cleanEmail,
                password
            );

            alert("Kayıt başarılı!");

            setEmail("");
            setPassword("");

            navigate("/login");

        } catch (error) {

            console.error(
                "Kayıt olurken hata oluştu:",
                error
            );

            alert(
                "Kayıt olurken hata oluştu. E-posta daha önce kullanılmış olabilir."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-icon">
                    📝
                </div>

                <h1>Kayıt Ol</h1>

                <p className="auth-subtitle">
                    BudgetWise hesabını oluştur.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="auth-input-group">

                        <label>
                            E-posta
                        </label>

                        <input
                            type="email"
                            placeholder="ornek@mail.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                            disabled={loading}
                        />

                    </div>

                    <div className="auth-input-group">

                        <label>
                            Şifre
                        </label>

                        <input
                            type="password"
                            placeholder="En az 6 karakter"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                            minLength={6}
                            disabled={loading}
                        />

                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "⏳ Kayıt yapılıyor..."
                            : "✨ Kayıt Ol"}
                    </button>

                </form>

                <div className="auth-register">

                    <span>
                        Zaten hesabın var mı?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                        disabled={loading}
                    >
                        Giriş Yap
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Register;