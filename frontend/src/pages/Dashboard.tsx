import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUser } from "../services/userService";

import {
  getExpenses,
  deleteExpense,
  updateExpense,
} from "../services/expenseService";

import {
  getIncomes,
  deleteIncome,
  updateIncome,
} from "../services/incomeService";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const [userEmail, setUserEmail] = useState("");

  const [editingExpenseId, setEditingExpenseId] =
    useState<number | null>(null);

  const [editExpenseTitle, setEditExpenseTitle] = useState("");
  const [editExpenseAmount, setEditExpenseAmount] = useState("");
  const [editExpenseCategory, setEditExpenseCategory] = useState("");
  const [editExpenseDate, setEditExpenseDate] = useState("");

  const [editingIncomeId, setEditingIncomeId] =
    useState<number | null>(null);

  const [editIncomeTitle, setEditIncomeTitle] = useState("");
  const [editIncomeAmount, setEditIncomeAmount] = useState("");
  const [editIncomeDate, setEditIncomeDate] = useState("");

  // =========================
  // VERİLERİ GETİR
  // =========================

  const loadExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Giderler alınamadı:", error);
    }
  };

  const loadIncomes = async () => {
    try {
      const data = await getIncomes();
      setIncomes(data);
    } catch (error) {
      console.error("Gelirler alınamadı:", error);
    }
  };

  useEffect(() => {
    loadExpenses();
    loadIncomes();

    const userId = localStorage.getItem("userId");

    if (userId) {
      getUser(Number(userId))
        .then((user) => {
          setUserEmail(user.email);
        })
        .catch((error) => {
          console.error(
            "Kullanıcı bilgileri alınamadı:",
            error
          );
        });
    }
  }, []);

  // =========================
  // ÇIKIŞ YAP
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");

    navigate("/login");
  };

  // =========================
  // DÖNEM FİLTRESİ
  // =========================

  const filteredExpenses =
    selectedPeriod === "all"
      ? expenses
      : expenses.filter(
          (expense) =>
            expense.date &&
            expense.date.startsWith(selectedPeriod)
        );

  const filteredIncomes =
    selectedPeriod === "all"
      ? incomes
      : incomes.filter(
          (income) =>
            income.date &&
            income.date.startsWith(selectedPeriod)
        );

  // =========================
  // TOPLAMLAR
  // =========================

  const totalIncome = filteredIncomes.reduce(
    (sum: number, income: any) =>
      sum + Number(income.amount),
    0
  );

  const totalExpense = filteredExpenses.reduce(
    (sum: number, expense: any) =>
      sum + Number(expense.amount),
    0
  );

  const balance = totalIncome - totalExpense;

  // =========================
  // GİDER SİL
  // =========================

  const handleDeleteExpense = async (id: number) => {
    try {
      await deleteExpense(id);
      await loadExpenses();
    } catch (error) {
      console.error("Gider silinemedi:", error);
      alert("Gider silinirken bir hata oluştu.");
    }
  };

  // =========================
  // GİDER DÜZENLE
  // =========================

  const handleEditExpense = (expense: any) => {
    setEditingExpenseId(expense.id);
    setEditExpenseTitle(expense.title);
    setEditExpenseAmount(String(expense.amount));
    setEditExpenseCategory(expense.category);
    setEditExpenseDate(expense.date || "");
  };

  const handleUpdateExpense = async (id: number) => {
    try {
      await updateExpense(
        id,
        editExpenseTitle,
        Number(editExpenseAmount),
        editExpenseCategory,
        editExpenseDate
      );

      setEditingExpenseId(null);
      await loadExpenses();
    } catch (error) {
      console.error("Gider güncellenemedi:", error);
      alert("Gider güncellenirken bir hata oluştu.");
    }
  };

  // =========================
  // GELİR SİL
  // =========================

  const handleDeleteIncome = async (id: number) => {
    try {
      await deleteIncome(id);
      await loadIncomes();
    } catch (error) {
      console.error("Gelir silinemedi:", error);
      alert("Gelir silinirken bir hata oluştu.");
    }
  };

  // =========================
  // GELİR DÜZENLE
  // =========================

  const handleEditIncome = (income: any) => {
    setEditingIncomeId(income.id);
    setEditIncomeTitle(income.title);
    setEditIncomeAmount(String(income.amount));
    setEditIncomeDate(income.date || "");
  };

  const handleUpdateIncome = async (id: number) => {
    try {
      await updateIncome(
        id,
        editIncomeTitle,
        Number(editIncomeAmount),
        editIncomeDate
      );

      setEditingIncomeId(null);
      await loadIncomes();
    } catch (error) {
      console.error("Gelir güncellenemedi:", error);
      alert("Gelir güncellenirken bir hata oluştu.");
    }
  };

  // =========================
  // KATEGORİ TOPLAMLARI
  // =========================

  const categoryTotals = filteredExpenses.reduce(
    (result: any[], expense: any) => {
      const existingCategory = result.find(
        (item) => item.name === expense.category
      );

      if (existingCategory) {
        existingCategory.value += Number(expense.amount);
      } else {
        result.push({
          name: expense.category,
          value: Number(expense.amount),
        });
      }

      return result;
    },
    []
  );

  const summaryData = [
    {
      name: "Gelir",
      tutar: totalIncome,
    },
    {
      name: "Gider",
      tutar: totalExpense,
    },
  ];

  const COLORS = [
    "#8b5cf6",
    "#6366f1",
    "#a78bfa",
    "#c084fc",
    "#818cf8",
  ];

  // =========================
  // TARİH FORMATLA
  // =========================

  const formatDate = (date: string) => {
    if (!date) {
      return "Tarih yok";
    }

    const parts = date.split("-");

    if (parts.length !== 3) {
      return date;
    }

    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  };

  return (
    <>
      <style>{`

        * {
          box-sizing: border-box;
        }

        .dashboard {
          min-height: 100vh;
          padding: 40px;
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
          color: #ffffff;
        }

        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard h1 {
          margin: 0;
          font-size: 42px;
          background:
            linear-gradient(
              90deg,
              #a78bfa,
              #60a5fa
            );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .welcome {
          color: #aeb7d1;
          margin-bottom: 10px;
          font-size: 16px;
        }

        .user-info {
          display: inline-block;
          margin-bottom: 30px;
          padding: 10px 16px;
          border-radius: 12px;
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.35);
          color: #ddd6fe;
          font-size: 14px;
          font-weight: 600;
        }

        /* =========================
           BUTONLAR
        ========================= */

        .dashboard-actions {
          display: flex;
          gap: 15px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .dashboard-actions button {
          border: none;
          padding: 14px 22px;
          border-radius: 12px;
          color: white;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;

          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #2563eb
            );

          box-shadow:
            0 8px 25px
            rgba(124,58,237,.3);

          transition:
            transform .25s,
            box-shadow .25s;
        }

        .dashboard-actions button:hover {
          transform: translateY(-2px);

          box-shadow:
            0 12px 30px
            rgba(124,58,237,.5);
        }

        .logout-button {
          background:
            linear-gradient(
              135deg,
              #be185d,
              #7c3aed
            ) !important;
        }

        /* =========================
           DÖNEM
        ========================= */

        .period-selector {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
          padding: 18px 22px;

          background:
            rgba(18,23,48,.88);

          border:
            1px solid
            rgba(139,92,246,.3);

          border-radius: 16px;
        }

        .period-selector label {
          color: #ddd6fe;
          font-weight: 600;
        }

        .period-selector select {
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #6366f1;
          background: #10162f;
          color: white;
          outline: none;
        }

        /* =========================
           KARTLAR
        ========================= */

        .cards {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);

          gap: 20px;
          margin-bottom: 25px;
        }

        .card {
          padding: 25px;
          border-radius: 20px;

          background:
            linear-gradient(
              145deg,
              rgba(30,35,72,.95),
              rgba(19,24,53,.95)
            );

          border:
            1px solid
            rgba(139,92,246,.3);

          box-shadow:
            0 15px 35px
            rgba(0,0,0,.25);

          transition:
            transform .25s,
            box-shadow .25s;
        }

        .card:hover {
          transform: translateY(-3px);

          box-shadow:
            0 20px 40px
            rgba(124,58,237,.2);
        }

        .card h3 {
          margin:
            0 0 12px;

          color: #b8b9d9;
          font-size: 15px;
        }

        .card p {
          margin: 0;
          font-size: 30px;
          font-weight: 800;
          color: #c4b5fd;
        }

        /* =========================
           GRAFİKLER
        ========================= */

        .charts {
          display: grid;
          grid-template-columns:
            1fr 1fr;

          gap: 20px;
          margin-bottom: 25px;
        }

        .chart-card,
        .income-list,
        .expense-list {

          background:
            rgba(18,23,48,.9);

          border:
            1px solid
            rgba(139,92,246,.28);

          border-radius: 20px;

          padding: 25px;

          box-shadow:
            0 15px 35px
            rgba(0,0,0,.25);
        }

        .chart-card h2,
        .income-list h2,
        .expense-list h2 {
          color: #ddd6fe;
          margin-top: 0;
        }

        /* =========================
           LİSTELER
        ========================= */

        .income-list,
        .expense-list {
          margin-bottom: 25px;
        }

        .income-item,
        .expense-item {

          display: flex;
          align-items: center;

          gap: 15px;

          padding: 16px;

          margin-bottom: 12px;

          border-radius: 14px;

          background:
            rgba(30,35,72,.75);

          border:
            1px solid
            rgba(99,102,241,.2);

          transition:
            transform .2s,
            border-color .2s;
        }

        .income-item:hover,
        .expense-item:hover {

          transform: translateY(-1px);

          border-color:
            rgba(139,92,246,.5);
        }

        .income-item > div,
        .expense-item > div {
          flex: 1;
        }

        .income-item strong,
        .expense-item strong {
          color: #ffffff;
        }

        .income-item p,
        .expense-item p {

          margin:
            5px 0 0;

          color: #929bb8;
          font-size: 13px;
        }

        /* =========================
           İŞLEM BUTONLARI
        ========================= */

        .action-button {

          border: none;

          border-radius: 9px;

          padding:
            9px 13px;

          color: white;

          cursor: pointer;

          font-weight: 600;

          transition:
            transform .2s,
            box-shadow .2s;
        }

        .action-button:hover {

          transform:
            translateY(-2px);

          box-shadow:
            0 6px 18px
            rgba(0,0,0,.25);
        }

        .edit-button {

          background:
            linear-gradient(
              135deg,
              #6366f1,
              #8b5cf6
            );
        }

        .delete-button {

          background:
            linear-gradient(
              135deg,
              #be185d,
              #7c2d92
            );
        }

        .save-button {

          background:
            linear-gradient(
              135deg,
              #059669,
              #2563eb
            );
        }

        .cancel-button {
          background: #374151;
        }

        /* =========================
           INPUTLAR
        ========================= */

        .income-item input,
        .expense-item input,
        .expense-item select {

          padding:
            10px;

          border-radius:
            9px;

          border:
            1px solid #6366f1;

          background:
            #0e1530;

          color: white;

          outline: none;

          min-width: 0;
        }

        .income-item input:focus,
        .expense-item input:focus,
        .expense-item select:focus {

          border-color:
            #a78bfa;

          box-shadow:
            0 0 0 3px
            rgba(139,92,246,.15);
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 900px) {

          .dashboard {
            padding: 25px;
          }

          .cards,
          .charts {
            grid-template-columns:
              1fr;
          }

        }

        /* =========================
           TELEFON
        ========================= */

        @media (max-width: 600px) {

          .dashboard {
            padding: 18px;
          }

          .dashboard h1 {
            font-size: 34px;
          }

          .welcome {
            font-size: 14px;
          }

          .dashboard-actions {
            display: grid;
            grid-template-columns:
              1fr;
          }

          .dashboard-actions button {
            width: 100%;
          }

          .period-selector {

            flex-direction:
              column;

            align-items:
              stretch;
          }

          .period-selector select {
            width: 100%;
          }

          .card {
            padding: 20px;
          }

          .card p {
            font-size: 26px;
          }

          .chart-card,
          .income-list,
          .expense-list {
            padding: 18px;
          }

          .income-item,
          .expense-item {

            flex-wrap:
              wrap;

            align-items:
              stretch;
          }

          .income-item > div,
          .expense-item > div {

            flex-basis:
              100%;
          }

          .income-item strong,
          .expense-item > strong {

            width:
              100%;
          }

          .action-button {

            flex:
              1;

            min-width:
              100px;
          }

          .income-item input,
          .expense-item input,
          .expense-item select {

            width:
              100%;

            flex:
              1 1 100%;
          }
        }

      `}</style>

      <div className="dashboard">

        <div className="dashboard-container">

          <h1>BudgetWise</h1>

          <p className="welcome">
            Gelir ve giderlerini kolayca takip et.
          </p>

          {userEmail && (
            <div className="user-info">
              👤 {userEmail}
            </div>
          )}

          {/* =========================
              AKSİYONLAR
          ========================= */}

          <div className="dashboard-actions">

            <button
              onClick={() =>
                navigate("/income")
              }
            >
              💰 Gelir Ekle
            </button>

            <button
              onClick={() =>
                navigate("/expense")
              }
            >
              💸 Gider Ekle
            </button>

            <button
              onClick={() =>
                navigate("/account")
              }
            >
              👤 Hesabım
            </button>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              🚪 Çıkış Yap
            </button>

          </div>

          {/* =========================
              DÖNEM
          ========================= */}

          <div className="period-selector">

            <label>
              📅 Dönem Seç
            </label>

            <select
              value={selectedPeriod}
              onChange={(e) =>
                setSelectedPeriod(
                  e.target.value
                )
              }
            >
              <option value="all">
                Tüm Dönemler
              </option>

              <option value="2026-01">
                Ocak 2026
              </option>

              <option value="2026-02">
                Şubat 2026
              </option>

              <option value="2026-03">
                Mart 2026
              </option>

              <option value="2026-04">
                Nisan 2026
              </option>

              <option value="2026-05">
                Mayıs 2026
              </option>

              <option value="2026-06">
                Haziran 2026
              </option>

              <option value="2026-07">
                Temmuz 2026
              </option>

              <option value="2026-08">
                Ağustos 2026
              </option>

              <option value="2026-09">
                Eylül 2026
              </option>

              <option value="2026-10">
                Ekim 2026
              </option>

              <option value="2026-11">
                Kasım 2026
              </option>

              <option value="2026-12">
                Aralık 2026
              </option>

            </select>

          </div>

          {/* =========================
              ÖZET KARTLARI
          ========================= */}

          <div className="cards">

            <div className="card">

              <h3>
                Toplam Bakiye
              </h3>

              <p>
                ₺
                {balance.toLocaleString(
                  "tr-TR"
                )}
              </p>

            </div>

            <div className="card">

              <h3>
                Toplam Gelir
              </h3>

              <p>
                ₺
                {totalIncome.toLocaleString(
                  "tr-TR"
                )}
              </p>

            </div>

            <div className="card">

              <h3>
                Toplam Gider
              </h3>

              <p>
                ₺
                {totalExpense.toLocaleString(
                  "tr-TR"
                )}
              </p>

            </div>

          </div>

          {/* =========================
              GRAFİKLER
          ========================= */}

          <div className="charts">

            <div className="chart-card">

              <h2>
                Gelir - Gider Durumu
              </h2>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={summaryData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#c4b5fd"
                  />

                  <YAxis
                    stroke="#c4b5fd"
                  />

                  <Tooltip
                    formatter={(value) =>
                      `₺${Number(
                        value
                      ).toLocaleString(
                        "tr-TR"
                      )}`
                    }
                  />

                  <Bar
                    dataKey="tutar"
                    fill="#8b5cf6"
                    radius={[
                      8,
                      8,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

            <div className="chart-card">

              <h2>
                Gider Dağılımı
              </h2>

              {categoryTotals.length ===
              0 ? (

                <p>
                  Bu dönemde gider
                  bulunmuyor.
                </p>

              ) : (

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <PieChart>

                    <Pie
                      data={categoryTotals}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >

                      {categoryTotals.map(
                        (
                          _: any,
                          index: number
                        ) => (

                          <Cell
                            key={`cell-${index}`}
                            fill={
                              COLORS[
                                index %
                                  COLORS.length
                              ]
                            }
                          />

                        )
                      )}

                    </Pie>

                    <Tooltip
                      formatter={(value) =>
                        `₺${Number(
                          value
                        ).toLocaleString(
                          "tr-TR"
                        )}`
                      }
                    />

                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              )}

            </div>

          </div>

          {/* =========================
              GELİRLER
          ========================= */}

          <div className="income-list">

            <h2>

              {selectedPeriod ===
              "all"
                ? "Son Gelirler"
                : "Seçilen Dönemin Gelirleri"}

            </h2>

            {filteredIncomes.length ===
            0 ? (

              <p>
                Bu dönemde gelir
                bulunmuyor.
              </p>

            ) : (

              filteredIncomes.map(
                (income) => (

                  <div
                    className="income-item"
                    key={income.id}
                  >

                    {editingIncomeId ===
                    income.id ? (

                      <>

                        <input
                          type="text"
                          value={
                            editIncomeTitle
                          }
                          onChange={(e) =>
                            setEditIncomeTitle(
                              e.target.value
                            )
                          }
                        />

                        <input
                          type="number"
                          value={
                            editIncomeAmount
                          }
                          onChange={(e) =>
                            setEditIncomeAmount(
                              e.target.value
                            )
                          }
                        />

                        <input
                          type="date"
                          value={
                            editIncomeDate
                          }
                          onChange={(e) =>
                            setEditIncomeDate(
                              e.target.value
                            )
                          }
                        />

                        <button
                          className="action-button save-button"
                          onClick={() =>
                            handleUpdateIncome(
                              income.id
                            )
                          }
                        >
                          💾 Kaydet
                        </button>

                        <button
                          className="action-button cancel-button"
                          onClick={() =>
                            setEditingIncomeId(
                              null
                            )
                          }
                        >
                          İptal
                        </button>

                      </>

                    ) : (

                      <>

                        <div>

                          <strong>
                            {income.title}
                          </strong>

                          <p>
                            📅{" "}
                            {formatDate(
                              income.date
                            )}
                          </p>

                        </div>

                        <strong>
                          ₺
                          {Number(
                            income.amount
                          ).toLocaleString(
                            "tr-TR"
                          )}
                        </strong>

                        <button
                          className="action-button edit-button"
                          onClick={() =>
                            handleEditIncome(
                              income
                            )
                          }
                        >
                          ✏️ Düzenle
                        </button>

                        <button
                          className="action-button delete-button"
                          onClick={() =>
                            handleDeleteIncome(
                              income.id
                            )
                          }
                        >
                          🗑️ Sil
                        </button>

                      </>

                    )}

                  </div>

                )
              )

            )}

          </div>

          {/* =========================
              GİDERLER
          ========================= */}

          <div className="expense-list">

            <h2>

              {selectedPeriod ===
              "all"
                ? "Son Giderler"
                : "Seçilen Dönemin Giderleri"}

            </h2>

            {filteredExpenses.length ===
            0 ? (

              <p>
                Bu dönemde gider
                bulunmuyor.
              </p>

            ) : (

              filteredExpenses.map(
                (expense) => (

                  <div
                    className="expense-item"
                    key={expense.id}
                  >

                    {editingExpenseId ===
                    expense.id ? (

                      <>

                        <input
                          type="text"
                          value={
                            editExpenseTitle
                          }
                          onChange={(e) =>
                            setEditExpenseTitle(
                              e.target.value
                            )
                          }
                        />

                        <input
                          type="number"
                          value={
                            editExpenseAmount
                          }
                          onChange={(e) =>
                            setEditExpenseAmount(
                              e.target.value
                            )
                          }
                        />

                        <select
                          value={
                            editExpenseCategory
                          }
                          onChange={(e) =>
                            setEditExpenseCategory(
                              e.target.value
                            )
                          }
                        >

                          <option value="Yemek">
                            Yemek
                          </option>

                          <option value="Ulaşım">
                            Ulaşım
                          </option>

                          <option value="Alışveriş">
                            Alışveriş
                          </option>

                          <option value="Fatura">
                            Fatura
                          </option>

                          <option value="Diğer">
                            Diğer
                          </option>

                        </select>

                        <input
                          type="date"
                          value={
                            editExpenseDate
                          }
                          onChange={(e) =>
                            setEditExpenseDate(
                              e.target.value
                            )
                          }
                        />

                        <button
                          className="action-button save-button"
                          onClick={() =>
                            handleUpdateExpense(
                              expense.id
                            )
                          }
                        >
                          💾 Kaydet
                        </button>

                        <button
                          className="action-button cancel-button"
                          onClick={() =>
                            setEditingExpenseId(
                              null
                            )
                          }
                        >
                          İptal
                        </button>

                      </>

                    ) : (

                      <>

                        <div>

                          <strong>
                            {expense.title}
                          </strong>

                          <p>
                            {expense.category}
                          </p>

                          <p>
                            📅{" "}
                            {formatDate(
                              expense.date
                            )}
                          </p>

                        </div>

                        <strong>
                          ₺
                          {Number(
                            expense.amount
                          ).toLocaleString(
                            "tr-TR"
                          )}
                        </strong>

                        <button
                          className="action-button edit-button"
                          onClick={() =>
                            handleEditExpense(
                              expense
                            )
                          }
                        >
                          ✏️ Düzenle
                        </button>

                        <button
                          className="action-button delete-button"
                          onClick={() =>
                            handleDeleteExpense(
                              expense.id
                            )
                          }
                        >
                          🗑️ Sil
                        </button>

                      </>

                    )}

                  </div>

                )
              )

            )}

          </div>

        </div>

      </div>
    </>
  );
}

export default Dashboard;