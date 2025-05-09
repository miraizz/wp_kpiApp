import './App.css';

function App() {
  return (
    <div className="App">
      {/* Header / Navbar */}
      <header>
        <h1>KPI Management System</h1>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Log In</a>
          <a href="#">Sign Up</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h2 style={{ fontWeight: 'bold' }}>Welcome to the KPI Management System</h2>
        <p>Your smart solution to track and manage performance efficiently</p>
      </section>

      {/* About Section */}
      <section className="section">
        <h2>About Us</h2>
        <p>We help organization streamline KPI tracking and achieve operational excellence</p>
      </section>

      {/* Features Section */}
      <section className="section">
        <h2>Features</h2>
        <p>
          Intuitive dashboard, real-time insights, user management, and automated reporting.<br />
          More coming soon...
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <h3>Quote of the day: What gets measured gets managed.</h3>
        <p>&copy; 2025 KPI Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
