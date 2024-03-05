let values: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

interface PoengKortIF {
  _poeng: number;
  set poeng(n: number);
  get poeng();
}

export interface SuitCount {
  [key: string]: number;
}

let farger: string[] = ["Klover", "Ruter", "Hjerter", "Spar"];

interface FargeKortIF {
  _farge: string;
  set farge(f: string);
  get farge();
}

export class SpillKort implements PoengKortIF, FargeKortIF {
  _poeng: number;
  _farge: string;

  constructor(n: number, f: string) {
    this._poeng = n;
    this._farge = f;
  }

  get poeng(): number {
    return this._poeng;
  }

  set poeng(p: number) {
    this._poeng = p;
  }

  get farge() {
    return this._farge;
  }

  set farge(f: string) {}
}

export class BridgeKort extends SpillKort {}

export class KortStokk {
  kortstokk: BridgeKort[] = this.shuffle_cards(this.getDeck());

  getDeck(): BridgeKort[] {
    let deck: BridgeKort[] = [];

    for (const i of farger) {
      console.log("Skriver fargen " + i);
      for (let x = 0; x < values.length; x++) {
        let bkBridgeKort: BridgeKort = new BridgeKort(values[x], i);
        deck.push(bkBridgeKort);
      }
    }
    return deck;
  }

  shuffle_cards(cards: BridgeKort[]): BridgeKort[] {
    // Fisher-Yates algorithm for å stokke kortene helt rettferdig
    for (let i = cards.length - 1; i > 0; i--) {
      let til = Math.random();

      const j = Math.floor(til * (i + 1));

      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }
}

// Card.ts

// enum Suit {
//   SPADES = "♠",
//   HEARTS = "♥",
//   DIAMONDS = "♦",
//   CLUBS = "♣",
// }

// interface Card {
//   rank: number;
//   suit: Suit;
// }

// export { Card, Suit };
