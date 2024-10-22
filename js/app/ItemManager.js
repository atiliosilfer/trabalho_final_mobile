import Item from '../model/Item.js';

/**
 * Gerenciador de itens
 * @class
 * @name ItemManager
 * @description Gerencia os itens de despesas da aplicação e os salva no localStorage
 */
export default class ItemManager {
  constructor() {
    this.items = [];
    this.loadItems();
  }

  addItem(item) {
    this.items.push(item);
    this.saveItems();
  }

  editItem(index, item) {
    this.items[index] = item;
    this.saveItems();
  }

  deleteItem(index) {
    this.items.splice(index, 1);
    this.saveItems();
  }

  saveItems() {
    const itemsJson = JSON.stringify(this.items);
    localStorage.setItem('items', itemsJson);
  }

  loadItems() {
    const itemsJson = localStorage.getItem('items');
    if (itemsJson) {
      const itemsArray = JSON.parse(itemsJson);
      this.items = itemsArray.map(
        itemData =>
          new Item(
            itemData.description,
            itemData.amount,
            itemData.value,
            itemData.sourceCurrency,
            itemData.targetCurrency
          )
      );
    }
  }

  get totalSource() {
    return this.items.reduce((sum, item) => sum + item.totalCurrent, 0);
  }
}
