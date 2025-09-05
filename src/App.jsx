import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { useState } from "react";
import User from "./User.jsx";
import Admin from "./Admin.jsx";
import Login from "./Login.jsx";
import "./App.css";
import Cliente from "./Cliente.jsx";

function App() {
  const [acessoAdmin, setAcessoAdmin] = useState(false);

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
        <NavLink
          to="/admin"
          className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}
        >
          Admin
        </NavLink>
      </nav>

      <Routes>
        <Route path="cliente" element={<Cliente />} />
        <Route path="/" element={<User />} />
        <Route
          path="/admin"
          element={
            acessoAdmin
              ? <Admin />
              : <Login onLogin={() => setAcessoAdmin(true)} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
