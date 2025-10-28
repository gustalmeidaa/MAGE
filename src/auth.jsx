// src/auth.jsx
export const getToken = () => localStorage.getItem("token");

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  } catch {
    return false;
  }
};

// 🔹 Nova função para extrair o nome (subject) do JWT
export const getUsernameFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    // No seu backend, o TokenService usa .withSubject(administrador.getUsername())
    return decoded.sub || decoded.username || decoded.login;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
