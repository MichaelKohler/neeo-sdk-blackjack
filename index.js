const prompt = require('prompt');
const Game = require('./lib/game');

const schema = {  
  properties:  {
    numberOfDecks:  {        
      pattern:   /^[0-9]+$/,
      message:   'Number of decks must be only numbers',
      required:  true      
    }   
  }  
};

prompt.start();

prompt.get(schema, (err,  result) => { 
  const game = new Game({
    numberOfDecks: result.numberOfDecks
  });
});
