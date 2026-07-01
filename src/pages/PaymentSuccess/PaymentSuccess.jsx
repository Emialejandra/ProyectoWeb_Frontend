import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      // 🔥 SIMULAMOS PAGO EXITOSO
      const user = JSON.parse(localStorage.getItem("user"));

      const updatedUser = {
        ...user,
        plan: "PRO",
        is_pro: true,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    setTimeout(() => {
      navigate("/dashboardUser");
    }, 1500);
  }, []);

  return (
    <div>
      <h2>Pago exitoso ✅</h2>
      <p>Activando plan PRO...</p>
    </div>
  );
}