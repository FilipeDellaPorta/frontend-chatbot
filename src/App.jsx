import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import User from "./User.jsx";
import "./App.css";
import Cliente from "./Cliente.jsx";

function App() {

  return (
    <Router>
      <nav className="navbar">
        <NavLink
          to="/cliente"
          className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
          Cliente
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}
        >
          User
        </NavLink>
      </nav>

      <Routes>
        <Route path="cliente" element={<Cliente />} />
        <Route path="/" element={<User />} />
      </Routes>
    </Router>
  );
}

export default App;
