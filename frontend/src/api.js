// All communication with the Flask backend lives here (Student 3).
const API_URL = "http://localhost:5000/api";

async function request(path, options) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new Error(
      "Cannot reach the server. Is the Flask backend running on port 5000?"
    );
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong.");
    error.fieldErrors = data.errors || {};
    throw error;
  }
  return data;
}

export const getEvents = () => request("/events");

export const getRegistrations = () => request("/registrations");

export const addRegistration = (payload) =>
  request("/registrations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const deleteRegistration = (id) =>
  request(`/registrations/${id}`, { method: "DELETE" });
