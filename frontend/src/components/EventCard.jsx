export default function EventCard({ event, onRegister }) {
  return (
    <article className="card">
      <h3>{event.name}</h3>
      <p className="meta">
        📅 {event.date} &nbsp;•&nbsp; 📍 {event.venue}
      </p>
      <p>{event.description}</p>
      <button className="btn" onClick={() => onRegister(event.name)}>
        Register
      </button>
    </article>
  );
}
