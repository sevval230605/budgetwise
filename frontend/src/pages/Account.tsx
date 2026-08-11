import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/userService";

function Account() {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId) {
      navigate("/login");
      return;
    }

    setUserId(storedUserId);

    getUser(Number(storedUserId))
      .then((user) => {
        setUserEmail(user.email);
      })
      .catch((error) => {
        console.error(
          "Kullanıcı bilgileri alınamadı:",
          error
        );
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");

    navigate("/login");
  };

  return (
    <div className="account-page">

      <div className="account-card">

        <div className="account-icon">
          👤
        </div>

        <h1>Hesabım</h1>

        <p className="account-subtitle">
          BudgetWise hesap bilgilerin
        </p>

        <div className="account-info">

          <div className="account-row">
            <span>E-posta</span>
            <strong>
              {userEmail || "Yükleniyor..."}
            </strong>
          </div>

          <div className="account-row">
            <span>Kullanıcı ID</span>
            <strong>
              {userId || "Yükleniyor..."}
            </strong>
          </div>

        </div>

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard'a Dön
        </button>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          🚪 Çıkış Yap
        </button>

      </div>

      <style>{`

        .account-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;

          background:
            radial-gradient(
              circle at top left,
              rgba(139,92,246,.25),
              transparent 30%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(37,99,235,.22),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #080b1a,
              #111936,
              #17104a
            );

          color: white;
          box-sizing: border-box;
        }

        .account-card {
          width: 100%;
          max-width: 500px;
          padding: 40px;

          background:
            rgba(18,23,48,.92);

          border:
            1px solid
            rgba(139,92,246,.35);

          border-radius: 24px;

          box-shadow:
            0 20px 50px
            rgba(0,0,0,.35);

          text-align: center;
        }

        .account-icon {
          font-size: 55px;
          margin-bottom: 15px;
        }

        .account-card h1 {
          margin: 0;

          font-size: 36px;

          background:
            linear-gradient(
              90deg,
              #a78bfa,
              #60a5fa
            );

          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .account-subtitle {
          color: #929bb8;
          margin-bottom: 30px;
        }

        .account-info {
          text-align: left;

          background:
            rgba(30,35,72,.75);

          border:
            1px solid
            rgba(99,102,241,.2);

          border-radius: 16px;

          padding: 10px 20px;

          margin-bottom: 25px;
        }

        .account-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;

          padding: 18px 0;

          border-bottom:
            1px solid
            rgba(255,255,255,.08);
        }

        .account-row:last-child {
          border-bottom: none;
        }

        .account-row span {
          color: #929bb8;
        }

        .account-row strong {
          color: #ddd6fe;
          word-break: break-word;
        }

        .back-button,
        .logout-button {
          width: 100%;
          border: none;

          padding: 14px;

          border-radius: 12px;

          color: white;

          font-size: 15px;
          font-weight: 700;

          cursor: pointer;

          margin-top: 10px;

          transition: .25s;
        }

        .back-button {
          background:
            linear-gradient(
              135deg,
              #6366f1,
              #8b5cf6
            );
        }

        .logout-button {
          background:
            linear-gradient(
              135deg,
              #be185d,
              #7c3aed
            );
        }

        .back-button:hover,
        .logout-button:hover {
          transform: translateY(-2px);

          box-shadow:
            0 10px 25px
            rgba(124,58,237,.35);
        }

        @media (max-width: 600px) {

          .account-page {
            padding: 18px;
          }

          .account-card {
            padding: 28px 20px;
          }

          .account-row {
            flex-direction: column;
            gap: 7px;
          }

        }

      `}</style>

    </div>
  );
}

export default Account;