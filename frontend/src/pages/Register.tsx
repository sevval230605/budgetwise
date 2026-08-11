import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
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
      await axios.post(
        "http://localhost:8080/users/register",
        {
          email: email,
          password: password,
        }
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

      alert("Kayıt olurken hata oluştu!");
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
            ✨ Kayıt Ol
          </button>

        </form>

        <div className="auth-register">

          <span>
            Zaten hesabın var mı?
          </span>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Giriş Yap
          </button>

        </div>

      </div>

    </div>
  );
}

export default Register;