import { useState } from "react";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function RegistrationForm({
  events,
  selectedEvent,
  onSelectEvent,
  onSubmit,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Basic validation: required fields filled in, email looks valid.
  function validate() {
    const found = {};
    if (!name.trim()) found.name = "Please enter your name.";
    if (!email.trim()) found.email = "Please enter your email address.";
    else if (!EMAIL_PATTERN.test(email.trim()))
      found.email = "Please enter a valid email address.";
    if (!selectedEvent) found.event = "Please select an event.";
    return found;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    const result = await onSubmit({
      name: name.trim(),
      email: email.trim(),
      event: selectedEvent,
    });
    setSubmitting(false);

    if (result.ok) {
      setName("");
      setEmail("");
      onSelectEvent("");
      setErrors({});
    } else {
      setErrors(result.fieldErrors); // errors sent back by the backend
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="name">Full name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ananya Sen"
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@college.edu"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="field">
        <label htmlFor="event">Event</label>
        <select
          id="event"
          value={selectedEvent}
          onChange={(e) => onSelectEvent(e.target.value)}
        >
          <option value="">-- Select an event --</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.name}>
              {ev.name}
            </option>
          ))}
        </select>
        {errors.event && <span className="error">{errors.event}</span>}
      </div>

      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? "Submitting…" : "Register"}
      </button>
    </form>
  );
}
