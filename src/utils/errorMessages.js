export const getFriendlyError = (error) => {
  const message = typeof error === 'string' ? error : (error?.message || "");
  const lowerMessage = message.toLowerCase();

  // Errores de autenticación - Login
  if (lowerMessage.includes("invalid login credentials") || 
      lowerMessage.includes("invalid credentials") ||
      lowerMessage.includes("credenciales inválidas") ||
      lowerMessage.includes("user not found")) {
    return "Usuario o contraseña incorrectos.";
  }

  // Errores de email
  if (lowerMessage.includes("email not confirmed")) {
    return "Debes confirmar tu correo electrónico antes de iniciar sesión.";
  }

  // Usuario ya registrado
  if (lowerMessage.includes("user already registered") ||
      lowerMessage.includes("already registered") ||
      lowerMessage.includes("already exists")) {
    return "Ya existe una cuenta registrada con este correo.";
  }

  // Errores de contraseña débil
  if (lowerMessage.includes("weak password") ||
      lowerMessage.includes("password should be at least")) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }

  // Errores de edad
  if (lowerMessage.includes("edad mínima") ||
      lowerMessage.includes("age") ||
      lowerMessage.includes("25")) {
    return "La edad mínima permitida es 25 años.";
  }

  // Errores de perfil incompleto
  if (lowerMessage.includes("categories")) {
    return "Debes seleccionar al menos una categoría.";
  }

  // Errores de validación
  if (lowerMessage.includes("duplicate key")) {
    return "Ya existe un registro con esos datos.";
  }

  if (lowerMessage.includes("contraseña")) {
    return "Error con la contraseña. Verifica que sea correcta.";
  }

  if (lowerMessage.includes("email") && lowerMessage.includes("requerido")) {
    return "El correo electrónico es requerido.";
  }

  if (lowerMessage.includes("bad request")) {
    return "No fue posible enviar el correo. Verifica tu correo e inténtalo de nuevo.";
  }

  if (lowerMessage.includes("object object") || lowerMessage.includes("{}")) {
    return "No fue posible procesar la solicitud. Inténtalo nuevamente.";
  }

  if (lowerMessage.includes("email")) {
    return "El correo electrónico no es válido.";
  }

  // Mensajes de éxito que vienen del backend
  if (lowerMessage.includes("éxito") || lowerMessage.includes("exitoso")) {
    return message;
  }

  if (lowerMessage.includes("actualizado")) {
    return message;
  }

  if (lowerMessage.includes("registrado")) {
    return message;
  }

  // Retorna el mensaje como está si es muy específico
  if (message && message.length < 100 && message.length > 5) {
    return message;
  }

  return "Ocurrió un error inesperado. Inténtalo nuevamente.";
};