import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Kullanıcı zaten giriş yaptıysa Dashboard'a gönder
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/users/login",
        {
          email: email,
          password: password,
        }
      );

      if (response.data.success) {
        localStorage.setItem(
          "userId",
          String(response.data.userId)
        );

        localStorage.setItem(
          "userEmail",
          response.data.email
        );

        alert("Giriş başarılı!");

        navigate("/dashboard");
      } else {
        alert("E-posta veya şifre hatalı!");
      }
    } catch (error) {
      console.error(
        "Giriş yapılırken hata oluştu:",
        error
      );

      alert("Giriş yapılırken hata oluştu!");
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
            <label>E-posta</label>

            <input
              type="email"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="auth-input-group">
            <label>Şifre</label>

            <input
              type="password"
              placeholder="Şifrenizi girin"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
          >
            🔑 Giriş Yap
          </button>

        </form>

        <div className="auth-register">

          <span>
            Hesabın yok mu?
          </span>

          <button
            type="button"
            onClick={() => navigate("/register")}
          >
            Kayıt Ol
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;