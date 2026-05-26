export const getFriendlyError = (error) => {
  const message = error?.message || "";

  if (message.includes("Invalid login credentials")) {
    return "Correo o contraseña incorrectos.";
  }

  if (message.includes("Email not confirmed")) {
    return "Debes confirmar tu correo electrónico antes de iniciar sesión.";
  }

  if (message.includes("User already registered")) {
    return "Ya existe una cuenta registrada con este correo.";
  }

  if (message.includes("categories")) {
    return "La configuración del perfil está incompleta. Contacte al administrador.";
  }

  if (message.includes("duplicate key")) {
    return "Ya existe un registro con esos datos.";
  }

  return "Ocurrió un error inesperado. Inténtalo nuevamente.";
};