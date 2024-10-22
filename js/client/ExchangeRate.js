/**
 * Classe de serviço para obter a taxa de câmbio entre duas moedas
 * @class
 * @name ExchangeRate
 * @description Obtém a taxa de câmbio entre duas moedas a partir de uma API externa
 */
export default class ExchangeRate {
  constructor() {
    this.rate = 0;
  }

  async updateRate(sourceCurrency, targetCurrency) {
    try {
      const url = `https://api.exchangerate-api.com/v4/latest/${sourceCurrency}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao buscar taxas de câmbio');
      }
      const data = await response.json();
      this.rate = data.rates[targetCurrency];
    } catch (error) {
      console.error(error);
      alert('Não foi possível obter a taxa de câmbio. Tente novamente mais tarde.');
    }
  }
}
