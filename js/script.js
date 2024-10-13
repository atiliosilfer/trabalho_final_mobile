const cepInput = document.getElementById("cepInput");
const searchButton = document.getElementById("searchButton");
const resultDiv = document.getElementById("result");
 
searchButton.addEventListener("click", async () => {
    const cep = cepInput.value.replace(/\D/g, "");
 
    if (cep.length !== 8) {
        alert("CEP inválido. Digite apenas os números.");
        return;
    }
 
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
 
        if (data.erro) {
            alert("CEP não encontrado.");
        } else {
            resultDiv.innerHTML = `
                <p>CEP: ${data.cep}</p>
                <p>Logradouro: ${data.logradouro}</p>
                <p>Bairro: ${data.bairro}</p>
                <p>Cidade: ${data.localidade}</p>
                <p>Estado: ${data.uf}</p>
            `;
        }
    } catch (error) {
        alert("Ocorreu um erro ao buscar o CEP.");
    }
});