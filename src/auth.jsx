// src/auth.jsx
const TOKEN_KEY = "userToken";
const LOGIN_KEY = "loginUsuario";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const [, payload] = token.split(".");
    // atob() decodifica Base64
    const decoded = JSON.parse(atob(payload));
    const now = Math.floor(Date.now() / 1000);
    
    // Verifica se a data de expiração (exp) é maior que o tempo atual
    return decoded.exp > now; 
  } catch {
    // Se a decodificação falhar (token malformado)
    return false;
  }
};

export const getUsernameFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    return decoded.sub || null; 
  } catch {
    return null;
  }
};

export const logout = () => {
  // 💡 Limpa as chaves corretas
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LOGIN_KEY); 
  window.location.href = "/login";
};