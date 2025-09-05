import { useState } from "react";
import "./Login.css";

export default function Login({ onLogin }) {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    const entrar = () => {
        if (usuario === "admin" && senha === "123456") {
            onLogin(); // habilita o acesso ao Admin
        } else {
            setErro("Usuário ou senha incorretos");
        }
    };

    return (
        <div className="login-container">
            <h2>Login Admin</h2>
            <input
                type="text"
                placeholder="Usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
            />
            <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />
            <button onClick={entrar}>Entrar</button>
            {erro && <p style={{ color: "red" }}>{erro}</p>}
        </div>
    );
}
