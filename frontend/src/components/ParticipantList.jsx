export default function ParticipantList({ participants, onDelete }) {
  if (participants.length === 0) {
    return <p className="muted">No one has registered yet. Be the first!</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Event</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p, index) => (
            <tr key={p.id}>
              <td>{index + 1}</td>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>{p.event}</td>
              <td>
                <button className="btn btn-danger" onClick={() => onDelete(p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
