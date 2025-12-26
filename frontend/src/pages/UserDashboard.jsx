import { useState, useEffect } from "react";
import API from "../api/axios";
import "./dashboard.css";
import { Navigate, useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tickets, setTickets] = useState([]);

  const navigate = useNavigate();

  const fetchTickets = async () => {
    const res = await API.get("/tickets");
    setTickets(res.data.tickets);
  };

  const createTicket = async (e) => {
    e.preventDefault();
    await API.post("/tickets", { title, description });
    setTitle("");
    setDescription("");
    fetchTickets();
  };

  useEffect(() => {
    fetchTickets();
  }, []);


   const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  return (
    <div className="user-dashboard">
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>

      <h2 className="dashboard-title">User Dashboard</h2>

      <form className="ticket-form" onSubmit={createTicket}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Create Ticket</button>
      </form>

      <h3 className="tickets-title">Your Tickets:</h3>
      <div className="ticket-list">
        {tickets.map((t) => (
          <div className="ticket-card" key={t.id}>
            <h4 className="ticket-title">{t.title}</h4>
            <p className="ticket-desc">{t.description}</p>
            <span className={`status ${t.status.toLowerCase()}`}>{t.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
