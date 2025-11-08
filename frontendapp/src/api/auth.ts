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

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}) {
  const res = await api.post("/register", data);
  return res.data;
}

// Get current user info
export async function getCurrentUser() {
  const res = await api.get("/users/me");
  return res.data;
}

// Add a new link
export async function addLink(title: string, url: string) {
  const res = await api.post("/links", { title, url });
  return res.data;
}

export async function updateLink(id: number, title: string, url: string) {
  const res = await api.put(`/links/${id}`, { title, url });
  return res.data;
}

export async function deleteLink(id: number) {
  const res = await api.delete(`/links/${id}`);
  return res.data;
}

// Get user's links
export async function getMyLinks() {
  const res = await api.get("/links/me");
  return res.data;
}

export async function getMySettings() {
  const res = await api.get("/settings/me");
  return res.data;
}

export async function updateSettings(data: Record<string, any>) {
  const res = await api.patch("/settings", data);
  return res.data;
}
