import "./Admin.css";
import { useState, useEffect } from "react";

export default function Admin() {
    const [produtos, setProdutos] = useState([]);
    const [perguntas, setPerguntas] = useState([]);
    const [novoProduto, setNovoProduto] = useState({ nome: "", descricao: "" });
    const [respostas, setRespostas] = useState({});
    const [novaPergunta, setNovaPergunta] = useState("");

    const backendURL = "https://backend-chatbot-nyq8.onrender.com"; //"http://127.0.0.1:8000";

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

        return () => clearInterval(interval);
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

    const criarProduto = () => {
        if (!novoProduto.nome || !novoProduto.descricao) return;

        fetch(`${backendURL}/produtos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoProduto),
        })
            .then(() => {
                setProdutos([...produtos, novoProduto]);
                setNovoProduto({ nome: "", descricao: "" });
            });
    };

    const criarPergunta = () => {
        if (!novaPergunta) return;

        fetch(`${backendURL}/pergunta`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pergunta: novaPergunta }),
        })
            .then(() => {
                setPerguntas([...perguntas, { pergunta: novaPergunta }]);
                setNovaPergunta("");
            });
    };

    return (
        <div className="container">
            <h1>Admin</h1>

            <div className="admin-section">
                <h2>Produtos</h2>
                <div className="admin-form">
                    <input
                        type="text"
                        placeholder="Nome do produto"
                        value={novoProduto.nome}
                        onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Descrição"
                        value={novoProduto.descricao}
                        onChange={(e) => setNovoProduto({ ...novoProduto, descricao: e.target.value })}
                        className="input-field"
                    />
                    <button onClick={criarProduto} className="button-primary">Adicionar Produto</button>
                </div>
                <ul className="produtos-lista">
                    {produtos.map((p, idx) => (
                        <li key={idx} className="produto-item">
                            {p.nome} - {p.descricao}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="admin-section">
                <h2>Perguntas</h2>
                <div className="admin-form">
                    <input
                        type="text"
                        placeholder="Nova pergunta"
                        value={novaPergunta}
                        onChange={(e) => setNovaPergunta(e.target.value)}
                        className="input-field"
                    />
                    <button onClick={criarPergunta} className="button-primary">Adicionar Pergunta</button>
                </div>
                <ul className="perguntas-lista">
                    {perguntas.map((p, idx) => (
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
                </ul>
            </div>
        </div>
    );
}