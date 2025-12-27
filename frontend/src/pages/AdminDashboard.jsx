import { useState, useEffect } from "react";
import API from "../api/axios";
import "./admin.css";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);

  const navigate = useNavigate();

  const fetchTickets = async () => {
    const res = await API.get("/admin/tickets");
    setTickets(res.data.tickets);
  };

  const updateStatus = async (id, status) => {
    await API.patch(`/admin/tickets/${id}/status`, { status });
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
    <div className="admin-dashboard">
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>

      <h2 className="dashboard-title">Admin Dashboard</h2>

      <div className="ticket-list">
        {tickets.map((t) => (
          <div className="ticket-card" key={t.id}>
            <div className="ticket-header">
              <h3>{t.title}</h3>
              <span className={`status ${t.status.toLowerCase()}`}>
                {t.status}
              </span>
            </div>

            <p className="assigned">
              Assigned to: <strong>{t.assigned_to || "None"}</strong>
            </p>

            <div className="actions">
              <button
                className="btn in-progress"
                onClick={() => updateStatus(t.id, "IN_PROGRESS")}
              >
                In Progress
              </button>

              <button
                className="btn resolved"
                onClick={() => updateStatus(t.id, "COMPLETED")}
              >
                Resolve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
