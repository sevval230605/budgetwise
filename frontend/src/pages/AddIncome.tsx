 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { createIncome } from "../services/incomeService";
 import "../App.css";

 function AddIncome() {
   const navigate = useNavigate();

   const [title, setTitle] = useState("");
   const [amount, setAmount] = useState("");
   const [date, setDate] = useState("");

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();

     try {
       await createIncome(
         title,
         Number(amount),
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

       alert("Gelir eklenirken hata oluştu!");
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
             />
           </div>

           <button
             type="submit"
             className="money-submit"
           >
             💰 Geliri Kaydet
           </button>

         </form>

       </div>
     </div>
   );
 }

 export default AddIncome;