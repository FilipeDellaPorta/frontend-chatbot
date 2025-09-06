import { useState } from "react";

const backendURL = "https://backend-chatbot-nyq8.onrender.com"; //"http://127.0.0.1:8000";

export default function Cliente() {
    const [pergunta, setPergunta] = useState("");
    const [resposta, setResposta] = useState("");

    const enviarPergunta = async () => {
        if (!pergunta) return;

        try {
            const res = await fetch(`${backendURL}/perguntas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pergunta })
            });

            const data = await res.json();
            console.log("Resposta do backend:", data);

            setResposta(data.resposta ?? "Sua pergunta foi enviada e logo será respondida.");
            setPergunta("");
        } catch (error) {
            console.error("Erro ao enviar pergunta:", error);
            setResposta("Erro ao se comunicar com o servidor.");
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "50px auto", fontFamily: "Arial", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
            <h2>Simulador Cliente</h2>
            <input
                type="text"
                placeholder="Digite sua pergunta"
                value={pergunta}
                onChange={(e) => setPergunta(e.target.value)}
                style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <button onClick={enviarPergunta} style={{ padding: "10px 20px", borderRadius: "5px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}>Enviar</button>

            {resposta && (
                <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f4f4f4", borderRadius: "5px" }}>
                    <strong>Resposta:</strong> {resposta}
                </div>
            )}
        </div>
    );
}
