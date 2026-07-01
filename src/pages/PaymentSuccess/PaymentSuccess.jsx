import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    console.log("Session ID:", sessionId);

    setTimeout(() => {
      navigate("/dashboardUser");
    }, 3000);
  }, [navigate, searchParams]);

  return (
    <div>
      <h1>✅ Pago exitoso</h1>
      <p>Redirigiendo al dashboard...</p>
    </div>
  );
}