import "./Admin.css";
import { useEffect, useState } from "react";

function Admin() {
    const [produtos, setProdutos] = useState([]);
    const [perguntas, setPerguntas] = useState([]);
    const [respostas, setRespostas] = useState({});

    // Chat do cliente
    const [perguntaChat, setPerguntaChat] = useState("");
    const [respostaChat, setRespostaChat] = useState("");

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
            .then((data) => {
                if (data.respondida) {
                    alert("Resposta enviada!");
                    setPerguntas(prev => prev.filter(p => p.id !== id));
                    setRespostas(prev => {
                        const copy = { ...prev };
                        delete copy[id];
                        return copy;
                    });
                } else {
                    alert("Erro ao enviar a resposta. Tente novamente.");
                }
            });
    };

    const [ultimaPerguntaEnviada, setUltimaPerguntaEnviada] = useState("");
    // Função para enviar pergunta pelo chat flutuante
    const enviarPerguntaChat = async () => {
        if (!perguntaChat) return;

        try {
            // Envia a pergunta
            await fetch(`${backendURL}/pergunta`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pergunta: perguntaChat })
            });

            // Guarda a pergunta antes de limpar o input
            setUltimaPerguntaEnviada(perguntaChat);

            // Limpa o input
            setPerguntaChat("");

            // Checa se a pergunta já está respondida no DB
            const res = await fetch(`${backendURL}/perguntas`);
            const data = await res.json();

            const perguntaNoDB = data.find(
                p => p.pergunta === perguntaChat
            );

            // Se ainda não tiver resposta, exibe a mensagem temporária
            if (!perguntaNoDB?.respondida) {
                setRespostaChat("Sua pergunta foi enviada e logo será respondida.");
            }

        } catch (error) {
            console.error("Erro ao enviar pergunta:", error);
            setRespostaChat("Erro ao se comunicar com o servidor.");
        }
    };

    // Buscar a resposta manual
    useEffect(() => {
        const fetchRespostaChat = async () => {
            if (!ultimaPerguntaEnviada) return;

            try {
                const res = await fetch(`${backendURL}/perguntas`);
                const data = await res.json();

                const respostaParaPergunta = data.find(
                    p => p.respondida && p.pergunta === ultimaPerguntaEnviada
                );

                if (respostaParaPergunta && respostaParaPergunta.resposta !== respostaChat) {
                    setRespostaChat(respostaParaPergunta.resposta);
                }
            } catch (error) {
                console.error("Erro ao buscar respostas do chat:", error);
            }
        };

        const interval = setInterval(fetchRespostaChat, 100);
        return () => clearInterval(interval);
    }, [ultimaPerguntaEnviada, respostaChat]);

    return (
        <div className="container">
            <div className="dashboard">
                {/* Lista de produtos */}
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

                {/* Chat flutuante */}
                <div id="chat-flutuante">
                    <div id="chat-header">Chat do Cliente</div>
                    <div id="chat-body">
                        {respostaChat && (
                            <div
                                style={{
                                    marginTop: "10px",
                                    padding: "10px",
                                    backgroundColor: "#f4f4f4",
                                    borderRadius: "5px"
                                }}
                            >
                                <strong>Resposta:</strong> {respostaChat}
                            </div>
                        )}
                    </div>
                    <input
                        id="chat-input"
                        type="text"
                        placeholder="Escreva sua mensagem..."
                        value={perguntaChat}
                        onChange={(e) => setPerguntaChat(e.target.value)}
                    />
                    <div style={{ display: "flex" }}>
                        <button id="chat-send" onClick={enviarPerguntaChat}>
                            Enviar
                        </button>
                        <button id="chat-end" onClick={() => {
                            setPerguntaChat("");
                            setRespostaChat("");
                        }}>
                            Encerrar
                        </button>
                    </div>
                </div>

                {/* Perguntas não respondidas */}
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

export default Admin;
