module.exports = class Card {
  constructor(options) {
    this.color = options.color;
    this.value = options.value;
  }

  getScore() {
    let cardValue = 0;

    switch(this.value) {
      case 'A':
        cardValue = 11;
        break;
      case 'K':
      case 'Q':
      case 'J':
      case '10':
        cardValue = 10;
        break;
      default:
        cardValue = parseInt(this.value, 10);
    }

    return cardValue;
  }

  toString() {
    return this.color + this.value;
  }
};
