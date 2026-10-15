import { useEffect, useState } from "react";
import EventCard from "./components/EventCard.jsx";
import RegistrationForm from "./components/RegistrationForm.jsx";
import ParticipantList from "./components/ParticipantList.jsx";
import {
  getEvents,
  getRegistrations,
  addRegistration,
  deleteRegistration,
} from "./api.js";

export default function App() {
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }
  const [loading, setLoading] = useState(true);

  // Load events and registrations when the page first opens.
  useEffect(() => {
    async function loadData() {
      try {
        const [eventData, registrationData] = await Promise.all([
          getEvents(),
          getRegistrations(),
        ]);
        setEvents(eventData);
        setParticipants(registrationData);
      } catch (err) {
        setMessage({ type: "error", text: err.message });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Called by the form. Returns field errors (if any) so the form can show them.
  async function handleRegister(formData) {
    try {
      const result = await addRegistration(formData);
      setParticipants((prev) => [...prev, result.registration]);
      setMessage({ type: "success", text: result.message });
      return { ok: true };
    } catch (err) {
      setMessage({ type: "error", text: err.message });
      return { ok: false, fieldErrors: err.fieldErrors || {} };
    }
  }

  async function handleDelete(id) {
    try {
      await deleteRegistration(id);
      setParticipants((prev) => prev.filter((p) => p.id !== id));
      setMessage({ type: "success", text: "Registration deleted." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  }

  function handleChooseEvent(eventName) {
    setSelectedEvent(eventName);
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="app">
      <header className="hero">
        <h1>College Event Registration</h1>
        <p>Browse upcoming events and reserve your spot in a minute.</p>
      </header>

      <main className="container">
        {message && (
          <div className={`banner ${message.type}`} role="status">
            <span>{message.text}</span>
            <button
              className="banner-close"
              onClick={() => setMessage(null)}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <section>
          <h2>Upcoming Events</h2>
          {loading ? (
            <p className="muted">Loading events…</p>
          ) : (
            <div className="event-grid">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRegister={handleChooseEvent}
                />
              ))}
            </div>
          )}
        </section>

        <section id="register">
          <h2>Register for an Event</h2>
          <RegistrationForm
            events={events}
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
            onSubmit={handleRegister}
          />
        </section>

        <section>
          <h2>Registered Participants ({participants.length})</h2>
          <ParticipantList participants={participants} onDelete={handleDelete} />
        </section>
      </main>

      <footer className="footer">
        College Event Registration System • React + Python Flask
      </footer>
    </div>
  );
}
