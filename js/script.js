const sendButton = document.getElementById("send");
const resultDiv = document.getElementById("result");
const descriptionInput = document.getElementById("inputDescription");
const amountInput = document.getElementById("inputAmount");
const valueInput = document.getElementById("inputValue");
const sourceCurrencySelect = document.getElementById("inputSourceCurrency");
const targetCurrencySelect = document.getElementById("inputTargetCurrency");

let saveControl = "save";
let itemToEditId = null;

let rate = 0;
let itens = [];

window.addEventListener("load", () => {
  sourceCurrencySelect.value = "USD";
  targetCurrencySelect.value = "BRL";
  getConversion();
});

function saveOrEdit(event) {
  event.preventDefault();
  if (saveControl == "save") {
    addItem();
  } else if (saveControl == "edit") {
    editItem();
  }
}

function fillEditForm(event) {
  const id = event.target.parentNode.parentNode.id;

  descriptionInput.value = itens[id].description;
  amountInput.value = itens[id].amount;
  valueInput.value = itens[id].value;
  sourceCurrencySelect.value = itens[id].sourceCurrency;
  saveControl = "edit";
  itemToEditId = id;
}

function addItem() {
  itens.push({
    description: descriptionInput.value,
    amount: amountInput.value,
    value: valueInput.value,
    sourceCurrency: sourceCurrencySelect.value,
    targetCurrency: targetCurrencySelect.value,
    rate: rate,
  });
  updateItensList();
}

function deleteItem(event) {
  const id = event.target.parentNode.parentNode.id;
  itens.splice(id, 1);
  updateItensList();
}

function editItem() {
  itens[itemToEditId] = {
    description: descriptionInput.value,
    amount: amountInput.value,
    value: valueInput.value,
    sourceCurrency: sourceCurrencySelect.value,
    targetCurrency: targetCurrencySelect.value,
    rate: rate,
  };
  updateItensList();
  saveControl = "save";
  itemToEditId = null;
}

function updateItensList() {
  let totalSumOrigen = 0;
  const totalSumSource = document.getElementById("totalSource");
  const totalSumtarget = document.getElementById("totaltarget");

  resultDiv.innerHTML = "";

  itens.forEach((item, index) => {
    let totalCurrent = item.amount * item.value;
    let totalTarget = totalCurrent * rate;
    resultDiv.innerHTML += `
    <div id='${index}'>
      <strong>
      ${item.description} (Qtd. ${item.amount}): ${totalCurrent} ${item.sourceCurrency} => ${totalTarget} ${item.targetCurrency}
      </strong>
      <button class="bg-dark border-0 rounded-pill px-3" onClick="fillEditForm(event)">
        <i class="fa-solid fa-pen" style="color: #ffffff"></i>
      </button>
      <button class="bg-danger border-0 rounded-pill px-3" onClick="deleteItem(event)">
        <i class="fa-solid fa-trash" style="color: #ffffff"></i>
      </button>
    </div>
        `;
    totalCurrent = 0;
    totalTarget = 0;
  });

  totalSumOrigen = itens.reduce(
    (a, b) => {
      const totalA = a.amount * a.value;
      const totaalB = b.amount * b.value;
      return totalA + totaalB;
    },
    { amount: 0, value: 0 }
  );

  if (isNaN(totalSumOrigen)) {
    totalSumOrigen = 0;
  }

  totalSumSource.innerHTML = `Total (Moeda de Origem): ${totalSumOrigen}`;
  totalSumtarget.innerHTML = `Total (Moeda de Destino): ${
    totalSumOrigen * rate
  }`;

  clearForm();
}

async function getConversion() {
  const url =
    "https://api.exchangerate-api.com/v4/latest/" + sourceCurrencySelect.value;
  const response = await fetch(url);
  const data = await response.json();
  rate = data.rates[targetCurrencySelect.value];
}

function clearForm() {
  descriptionInput.value = "";
  amountInput.value = "";
  valueInput.value = "";
}

sourceCurrencySelect.addEventListener("change", () => {
  getConversion();
});

targetCurrencySelect.addEventListener("change", () => {
  getConversion();
});
