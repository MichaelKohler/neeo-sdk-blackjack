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
        return color + value;
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

  getCardScore(representation) {
    // Let's split off the first 2 (it's unicode!) characters to get the value representation
    const cardValueRepresentation = representation.substr(2, representation.length - 2);
    let cardValue = 0;

    switch(cardValueRepresentation) {
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
        cardValue = parseInt(cardValueRepresentation, 10);
    }

    return cardValue;
  }

  checkBlackjackPotential(cards) {
    const firstCard = this.getCardScore(cards[0]);
    const secondCard = this.getCardScore(cards[1]);

    return firstCard === 'A' || secondCard === 'A';
  }
}
