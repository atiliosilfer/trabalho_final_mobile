import Item from '../model/Item.js';
import ItemManager from './ItemManager.js';
import ExchangeRate from '../client/ExchangeRate.js';

/**
 * Aplicação de despesas
 * @class
 * @name ExpenseApp
 * @description Aplicação de despesas que converte valores de uma moeda para outra
 */
export default class ExpenseApp {
  constructor() {
    this.sendButton = document.getElementById('send');
    this.resultDiv = document.getElementById('result');
    this.descriptionInput = document.getElementById('inputDescription');
    this.amountInput = document.getElementById('inputAmount');
    this.valueInput = document.getElementById('inputValue');
    this.sourceCurrencySelect = document.getElementById('inputSourceCurrency');
    this.targetCurrencySelect = document.getElementById('inputTargetCurrency');
    this.totalSumSource = document.getElementById('totalSource');
    this.totalSumTarget = document.getElementById('totaltarget');

    this.saveControl = 'save';
    this.itemToEditId = null;

    this.exchangeRate = new ExchangeRate();
    this.itemManager = new ItemManager();

    this.initialize();
  }

  initialize() {
    window.addEventListener('load', async () => {
      await this.getConversion();
      this.updateItemsList();
    });

    this.sourceCurrencySelect.addEventListener('change', () => {
      this.getConversion();
    });

    this.targetCurrencySelect.addEventListener('change', () => {
      this.getConversion();
    });

    this.sendButton.addEventListener('click', (event) => {
      this.saveOrEdit(event);
    });
  }

  async getConversion() {
    await this.exchangeRate.updateRate(
      this.sourceCurrencySelect.value,
      this.targetCurrencySelect.value
    );
    this.updateItemsList();
  }

  isValidInput() {
    return (
      this.descriptionInput.value.trim() !== '' &&
      parseFloat(this.amountInput.value) > 0 &&
      parseFloat(this.valueInput.value) > 0
    );
  }

  saveOrEdit(event) {
    event.preventDefault();
    if (!this.isValidInput()) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }
    if (this.saveControl === 'save') {
      this.addItem();
    } else if (this.saveControl === 'edit') {
      this.editItem();
    }
  }

  addItem() {
    const item = new Item(
      this.descriptionInput.value,
      this.amountInput.value,
      this.valueInput.value,
      this.sourceCurrencySelect.value,
      this.targetCurrencySelect.value
    );
    this.itemManager.addItem(item);
    this.updateItemsList();
    this.clearForm();
  }

  editItem() {
    const item = new Item(
      this.descriptionInput.value,
      this.amountInput.value,
      this.valueInput.value,
      this.sourceCurrencySelect.value,
      this.targetCurrencySelect.value
    );
    this.itemManager.editItem(this.itemToEditId, item);
    this.updateItemsList();
    this.saveControl = 'save';
    this.itemToEditId = null;
    this.clearForm();
  }

  deleteItem(event) {
    const id = event.target.closest('div').id;
    this.itemManager.deleteItem(id);
    this.updateItemsList();
  }

  fillEditForm(event) {
    this.sendButton.innerHTML = 'Editar';
    const id = event.target.closest('div').id;
    const item = this.itemManager.items[id];

    this.descriptionInput.value = item.description;
    this.amountInput.value = item.amount;
    this.valueInput.value = item.value;
    this.sourceCurrencySelect.value = item.sourceCurrency;
    this.targetCurrencySelect.value = item.targetCurrency;

    this.saveControl = 'edit';
    this.itemToEditId = id;
  }

  updateItemsList() {
    this.resultDiv.innerHTML = '';

    this.itemManager.items.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.id = index;

      const totalTarget = item.totalCurrent * this.exchangeRate.rate;

      const itemContent = document.createElement('strong');
      itemContent.innerHTML = `${item.description} (Qtd. ${item.amount}): ${item.totalCurrent.toFixed(
        2
      )} ${item.sourceCurrency} => ${totalTarget.toFixed(2)} ${item.targetCurrency}`;
      itemDiv.appendChild(itemContent);

      const editButton = document.createElement('button');
      editButton.className = 'bg-dark border-0 rounded-pill px-3';
      editButton.innerHTML = '<i class="fa-solid fa-pen" style="color: #ffffff"></i>';
      editButton.addEventListener('click', (event) => this.fillEditForm(event));
      itemDiv.appendChild(editButton);

      const deleteButton = document.createElement('button');
      deleteButton.className = 'bg-danger border-0 rounded-pill px-3';
      deleteButton.innerHTML = '<i class="fa-solid fa-trash" style="color: #ffffff"></i>';
      deleteButton.addEventListener('click', (event) => {
        const confirmation = confirm(
          'Tem certeza que deseja deletar este item?'
        );
        if (confirmation) {
          this.deleteItem(event);
        }
      });
      itemDiv.appendChild(deleteButton);

      this.resultDiv.appendChild(itemDiv);
    });

    const totalSource = this.itemManager.totalSource.toFixed(2);
    const totalTarget = (
      this.itemManager.totalSource * this.exchangeRate.rate
    ).toFixed(2);

    this.totalSumSource.innerHTML = `Total (Moeda de Origem): ${totalSource} ${this.sourceCurrencySelect.value}`;
    this.totalSumTarget.innerHTML = `Total (Moeda de Destino): ${totalTarget} ${this.targetCurrencySelect.value}`;
  }

  clearForm() {
    this.descriptionInput.value = '';
    this.amountInput.value = '';
    this.valueInput.value = '';
    this.sendButton.innerHTML = 'Adicionar';
  }
}
