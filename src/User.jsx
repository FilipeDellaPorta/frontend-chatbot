import "./User.css";
import { useEffect, useState } from "react";

function User() {
    const [produtos, setProdutos] = useState([]);
    const [perguntas, setPerguntas] = useState([]);
    const [respostas, setRespostas] = useState({});

    const backendURL = "http://127.0.0.1:8000"; // URL do seu FastAPI

    // Buscar produtos
    useEffect(() => {
        fetch(`${backendURL}/produtos`)
            .then(res => res.json())
            .then(data => setProdutos(data));
    }, []);

    // Buscar perguntas não respondidas
    useEffect(() => {
        const fetchPerguntas = () => {
            fetch(`${backendURL}/nao-respondidas`)
                .then(res => res.json())
                .then(data => setPerguntas(data));
        };

        fetchPerguntas(); // busca inicial
        const interval = setInterval(fetchPerguntas, 5000); // a cada 5 segundos

        return () => clearInterval(interval); // limpa o intervalo quando o componente desmonta
    }, []);

    // Enviar resposta manual
    const enviarResposta = (id) => {
        fetch(`${backendURL}/responder`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, resposta: respostas[id] }),
        })
            .then(res => res.json())
            .then(() => {
                alert("Resposta enviada!");
                // Remove a pergunta da lista
                setPerguntas(perguntas.filter(p => p.id !== id));
                // Remove a resposta do estado
                setRespostas((prev) => {
                    const copy = { ...prev };
                    delete copy[id];
                    return copy;
                });
            });
    };

    return (
        <div className="container">
            <div className="dashboard">
                <div className="produtos-container">
                    <h1>Produtos Cadastrados</h1>
                    <ul className="produtos-lista">
                        {produtos.map(p => (
                            <li key={p.id} className="produto-item">
                                {p.nome} - {p.descricao}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="perguntas-container">
                    <h1>Perguntas Não Respondidas</h1>
                    <div className="perguntas-lista">
                        {perguntas.map(p => (
                            <div key={p.id} className="pergunta-card">
                                <strong className="pergunta-text">{p.pergunta}</strong>
                                <input
                                    type="text"
                                    placeholder="Digite a resposta"
                                    className="pergunta-input"
                                    value={respostas[p.id] || ""}
                                    onChange={(e) =>
                                        setRespostas({ ...respostas, [p.id]: e.target.value })
                                    }
                                />
                                <button
                                    className="pergunta-button"
                                    onClick={() => enviarResposta(p.id)}
                                >
                                    Enviar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default User;