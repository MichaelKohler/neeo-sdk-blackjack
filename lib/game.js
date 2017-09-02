const prompt = require('prompt');
const Deck = require('./deck');

const PLAYER = 'PLAYER';
const DEALER = 'DEALER';

module.exports = class Game {
  constructor(options) {
    this.numberOfDecks = options.numberOfDecks;

    console.log(`starting new game series with ${this.numberOfDecks} decks`);

    this.setup();
  }

  setup(options) {
    this.playerCards = [];
    this.dealerCards = [];

    this.deck = new Deck({
      numberOfDecks: this.numberOfDecks
    });

    const numberOfCards = this.deck.getRemainingCards().length;
    console.log(`full deck has ${numberOfCards} cards`);

    this.deal(2, PLAYER);
    this.startAskingQuestions();
  }

  deal(times, player) {
    const cards = player === PLAYER ? this.playerCards : this.dealerCards;

    for (let i = 0; i < times; i++) {
      const nextCard = this.deck.getNextCard();

      cards.push(nextCard);
      console.log('New cards', cards);

      if (this.checkBust(cards) && player === PLAYER) {
        console.log('Ooops, that is too many!', this.getScore(cards));
        this.askForNewGame();
        return false;
      }
    }

    return true;
  }

  checkBust(cards) {
    return this.getScore(cards) > 21;
  }

  checkBlackjack() {
    // FIXME: implement!!
    return false;
  }

  getScore(cards) {
    return cards.reduce((score, card) => {
      const cardScore = this.deck.getCardScore(card);
      return score + cardScore;
    }, 0);
  }

  startAskingQuestions() {
    console.log('Your current value is', this.getScore(this.playerCards));

    if (this.checkBlackjack(this.playerCards)) {
      console.log('Blackjack!');
      return this.dealerFinishGame();
    }

    console.log('What do you want to do? s=stay, c=card');

    const schema = {  
      properties:  {
        command:  {        
          pattern:   /^[s|c]$/,
          message:   'Command needs to be either s or c',
          required:  true      
        }   
      }  
    };

    prompt.start();

    prompt.get(schema, (err,  result) => { 
      switch(result.command) {
        case 's':
          console.log('You decided to stay on', this.getScore(this.playerCards));
          this.dealerFinishGame();
          break;
        case 'c':
          console.log('You decided to get another card');
          const stillOk = this.deal(1, PLAYER);

          if (stillOk) {
            this.startAskingQuestions();
          }

          break;
        default:
          console.log('that should not have happened!');
      }
    });
  }

  dealerFinishGame() {
    let dealerPoints = this.getScore(this.dealerCards);

    while (dealerPoints < 17) {
      this.deal(1, DEALER);
      dealerPoints = this.getScore(this.dealerCards);
    }

    if (this.checkBust(this.dealerCards)) {
      console.log('Dealer busted, you win!');
      return this.askForNewGame();
    }

    const playerPoints = this.getScore(this.playerCards);

    if (dealerPoints > playerPoints) {
      console.log(`Dealer has more points (${dealerPoints}), you lose!`);
    } else if (dealerPoints === playerPoints) {
      console.log('You have the same score, tie!');
    } else {
      console.log('YOU WIN!!!');
    }

    this.askForNewGame();
  }

  askForNewGame() {
    console.log('---------------------------')
    console.log('Do want do play a new game? (y/n)');

    const schema = {  
      properties:  {
        command:  {        
          pattern:   /^[y|n]$/,
          message:   'Command needs to be y (yes) or n (no)',
          required:  true      
        }   
      }  
    };

    prompt.start();

    prompt.get(schema, (err,  result) => { 
      switch(result.command) {
        case 'y':
          this.restart();
          break;
        case 'n':
          process.exit(0);
          break;
        default:
          console.log('that should not have happened!');
      }
    });
  }

  restart() {
    this.setup();
  }
}
