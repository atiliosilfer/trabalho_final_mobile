/**
 * Classe de modelo para representar um item de despesa
 * @class
 * @name Item
 * @description Representa um item de despesa com descrição, quantidade, valor, moeda de origem e moeda de destino
 */
export default class Item {
  constructor(description, amount, value, sourceCurrency, targetCurrency) {
    this.description = description;
    this.amount = parseFloat(amount);
    this.value = parseFloat(value);
    this.sourceCurrency = sourceCurrency;
    this.targetCurrency = targetCurrency;
  }

  get totalCurrent() {
    return this.amount * this.value;
  }
}
