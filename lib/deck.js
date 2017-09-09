const Card = require('./card');

const COLORS = ['♦︎', '♣︎', '♠︎', '♥︎'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

module.exports = class Deck {
  constructor(options) {
    this.numberOfDecks = options.numberOfDecks;
    this.cards = [];
    this.isNew = true;
    this.generateDecks();
  }

  generateFullDeck() {
    console.log('generating full deck');
    return COLORS.reduce((cards, color) => {
      const allColoredNumberCards = VALUES.map((value) => {
        return new Card({
          color,
          value
        });
      });

      console.log('generated cards for', color);

      cards = cards.concat(allColoredNumberCards);
      return cards;
    }, []);
  }

  generateDecks() {
    if (!this.isNew) {
      console.log('it is not allowed to multiply a deck that is already being played!');
      return this.cards;
    }

    const oneDeck = this.generateFullDeck();

    for (let i = 0; i < this.numberOfDecks; i++) {
      this.cards = this.cards.concat(oneDeck);
    }
  }

  getRemainingCards() {
    return this.cards;
  }

  getNextCard() {
    this.isNew = false;

    const numberOfTotalCards = this.cards.length;
    const randomIndex = Math.floor(Math.random() * numberOfTotalCards);
    const nextCard = this.cards.splice(randomIndex, 1);
    return nextCard[0];
  }

  checkBlackjackPotential(cards) {
    const firstCard = cards[0].value;
    const secondCard = cards[1].value;

    return firstCard === 'A' || secondCard === 'A';
  }
}
