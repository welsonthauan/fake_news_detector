async function analyzeNews() {

    const text = document.getElementById("news").value;

    if(text.trim() === "") {
        alert("Digite uma notícia.");
        return;
    }

    const resultDiv = document.getElementById("result");

    resultDiv.innerHTML = `
        <div class="loading">
            🧠 IA analisando notícia...
        </div>
    `;

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/predict",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    text: text
                })
            }
        );

        const data = await response.json();

        if(data.error) {

            resultDiv.innerHTML = `
                <div class="result-title fake">
                    ❌ Erro
                </div>

                <p>${data.error}</p>
            `;

            return;
        }
        const resultClass =
    data.result.includes("Fake")
        ? "fake"
        : "real";

resultDiv.innerHTML = `
    <div class="result-title ${resultClass}">
        ${data.result}
    </div>

    <div class="stats">

        <div class="stat-card">
            <div class="stat-label">
                🔴 Fake News
            </div>

            <div class="stat-value">
                ${data.fake_probability}%
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-label">
                🟢 Notícia Real
            </div>

            <div class="stat-value">
                ${data.true_probability}%
            </div>
        </div>

    </div>

    <div class="explanation">
        📖 ${data.explanation}
    </div>
`;
} catch(error) {

    console.error(error);

    resultDiv.innerHTML = `
        <div class="result-title fake">
            ❌ Erro ao conectar
        </div>

        <p>
            Não foi possível conectar com a API.
        </p>
    `;
}
}