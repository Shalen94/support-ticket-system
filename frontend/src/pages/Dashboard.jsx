import "./dashboard.css";

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2>🎟️ Support Desk</h2>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <section className="dashboard-hero">
        <h1>Welcome Back 👋</h1>
        <p>Manage your tickets and track their status easily.</p>
      </section>

      <section className="dashboard-cards">
        <div className="card">
          <h3>📩 Create Ticket</h3>
          <p>Raise a new support request</p>
          <button>Create</button>
        </div>

        <div className="card">
          <h3>📋 My Tickets</h3>
          <p>View all your submitted tickets</p>
          <button>View</button>
        </div>

        <div className="card">
          <h3>✅ Resolved</h3>
          <p>Check resolved issues</p>
          <button>Check</button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
