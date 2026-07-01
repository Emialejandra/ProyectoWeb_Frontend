const API_URL = import.meta.env.VITE_API_URL;

export const createCheckoutSession = async (token) => {
    const response = await fetch(
        `${API_URL}/api/payments/create-checkout-session`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error("No se pudo crear la sesión de pago.");
    }

    const data = await response.json();

    console.log("RESPUESTA BACKEND:", data);

    const url = data.data?.url;

    if (!url) {
        throw new Error("No se recibió URL de pago");
    }

    window.location.href = url;
};