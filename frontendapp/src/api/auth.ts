import api from "./axios";

// ✅ Login function
export async function loginUser(username: string, password: string) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  const res = await api.post("/token", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data;
}

// ✅ Optional: register function (if you have /register endpoint)
export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}) {
  const res = await api.post("/register", data);
  return res.data;
}
