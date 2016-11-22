## Chinese Poker

I want to play Chinese poker with my friends.

## Setup
0. `npm install`
1. `node server.js`
2. Navigate to `localhost:8080`
3. Enter a username/game code

## Code organization
* Add/look for 'todo' items in todo.org
* Server code is in server.js
* Client code starts with site/js/init.js

## How to play the game

- The game consists of rounds of playing cards.
- The first play in a round determines the type of play.
  - The first play of the _game_ must include the 3 of diamonds
- Subsequent plays must be stronger than the previous play.
- A round ends when all other players pass to a play. The user who made the last play begins the next round.
- When a player runs out of cards, they are "out" - other players have a chance to continue the round as with any other plays.
  - A user cannot go out with any play that includes the 2 of spades.
- The first player that goes out wins, then second place, etc.

### Card Strength
Cards are compared first by rank, then by suit.
  - 3,4,5,6,7,8,9,10,J,Q,K,A,2
  - Diamonds, Clubs, Hearts, Spades

The 3 of Diamonds is the lowest card, and the 2 of Spades is the highest card.

### Types of play
There are four types of play.
#### Singles
#### Pairs
#### Triples
#### Five-Card hands
- Straight (3,4,5,6,7). Straights are compared by the last card in their sequence.
- Flush. Flushes are compared first by suit, then by high card (e.g. a spade flush always beats a diamond flush)
- Full House (Triple and Pair) Full houses are compared by triple
- Bomb (Quadruple and Kicker)
- Straight Flush (3D,4D,5D,6D,7D). Straight Flushes are compared first by suit, and then by last in sequence.

