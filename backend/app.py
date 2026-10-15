import re

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

EVENTS = [
    {
        "id": 1,
        "name": "Coding Competition",
        "date": "20 Nov 2026",
        "venue": "Computer Lab 1",
        "description": "Solve problem-solving challenges against the clock and win prizes.",
    },
    {
        "id": 2,
        "name": "Web Development Workshop",
        "date": "25 Nov 2026",
        "venue": "Seminar Hall",
        "description": "A hands-on session on building websites with React and Flask.",
    },
    {
        "id": 3,
        "name": "Cultural Fest",
        "date": "02 Dec 2026",
        "venue": "Main Auditorium",
        "description": "Music, dance, drama and food stalls - a day of celebration.",
    },
    {
        "id": 4,
        "name": "Tech Quiz",
        "date": "05 Dec 2026",
        "venue": "Room 204",
        "description": "Test your knowledge of technology, science and general trivia.",
    },
]

registrations = []   
next_id = 1          
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")



@app.get("/api/events")
def get_events():
    """Return the list of available events."""
    return jsonify(EVENTS)


@app.get("/api/registrations")
def get_registrations():
    """Return every registration made so far."""
    return jsonify(registrations)


@app.post("/api/registrations")
def add_registration():
    """Validate the submitted data and add it to the temporary list."""
    global next_id

    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    event_name = str(data.get("event", "")).strip()


    errors = {}
    if not name:
        errors["name"] = "Name is required."
    if not email:
        errors["email"] = "Email is required."
    elif not EMAIL_PATTERN.match(email):
        errors["email"] = "Please enter a valid email address."
    if not event_name:
        errors["event"] = "Please select an event."
    elif event_name not in [e["name"] for e in EVENTS]:
        errors["event"] = "Selected event does not exist."

    if errors:
        return jsonify({"message": "Validation failed.", "errors": errors}), 400


    for r in registrations:
        if r["email"].lower() == email.lower() and r["event"] == event_name:
            return (
                jsonify({
                    "message": "This email is already registered for that event.",
                    "errors": {"email": "Already registered for this event."},
                }),
                409,
            )

    registration = {"id": next_id, "name": name, "email": email, "event": event_name}
    next_id += 1
    registrations.append(registration)

    return (
        jsonify({
            "message": f"Registration successful! See you at {event_name}, {name}.",
            "registration": registration,
        }),
        201,
    )


@app.delete("/api/registrations/<int:reg_id>")
def delete_registration(reg_id):
    """Remove a registration from the temporary list."""
    for i, r in enumerate(registrations):
        if r["id"] == reg_id:
            registrations.pop(i)
            return jsonify({"message": "Registration deleted."})
    return jsonify({"message": "Registration not found."}), 404


if __name__ == "__main__":
    app.run(debug=True, port=5000)
