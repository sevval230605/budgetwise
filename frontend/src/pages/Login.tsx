import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/userService";
import "../App.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const cleanEmail = email.trim();

        if (!cleanEmail || !password) {
            alert("Lütfen e-posta ve şifre girin.");
            return;
        }

        try {
            setLoading(true);

            const response = await loginUser(
                cleanEmail,
                password
            );

            if (response.success) {

                if (!response.userId || !response.token) {
                    alert("Giriş bilgileri alınamadı.");
                    return;
                }

                localStorage.setItem(
                    "userId",
                    String(response.userId)
                );

                localStorage.setItem(
                    "userEmail",
                    response.email || cleanEmail
                );

                localStorage.setItem(
                    "token",
                    response.token
                );

                alert("Giriş başarılı!");

                navigate("/dashboard");

            } else {

                alert(
                    response.message ||
                    "E-posta veya şifre hatalı!"
                );
            }

        } catch (error) {

            console.error(
                "Giriş yapılırken hata oluştu:",
                error
            );

            alert(
                "Giriş yapılırken hata oluştu!"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-icon">
                    🔐
                </div>

                <h1>Giriş Yap</h1>

                <p className="auth-subtitle">
                    BudgetWise hesabına giriş yap.
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
                            placeholder="Şifrenizi girin"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                            disabled={loading}
                        />

                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "⏳ Giriş yapılıyor..."
                            : "🔑 Giriş Yap"}
                    </button>

                </form>

                <div className="auth-register">

                    <span>
                        Hesabın yok mu?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/register")
                        }
                        disabled={loading}
                    >
                        Kayıt Ol
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Login;