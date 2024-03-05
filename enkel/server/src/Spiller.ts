import * as Card from "./Card";
import { SpillKort, BridgeKort, KortStokk } from "./Card";

//Spiller, så enkelt som mulig

export enum Plass {
  Uplassert,
  Nord,
  Ost,
  Syd,
  Vest,
}

interface SpillerIF {
  _kort: SpillKort[]; //samme som kort: Array<SpillKort>
}

export class BridgeSpiller {
  _kort: BridgeKort[] = [];
  plass: Plass = Plass.Uplassert;

  constructor(p: Plass, k: BridgeKort[]) {
    this._kort = k; //this.trettenkort(k.kortstokk);
    this.plass = p;
  }

  get kort(): BridgeKort[] {
    return this._kort;
  }

  // Kommer tilbake til hvorfor dette ikke virker
  // trettenkort = (k: BridgeKort[]) => { if (k) return k.slice(0,13); else return k;};

  opening_tellPoengOgMeld(cardio?: BridgeKort[]): string {
    let points = 0;

    let suits: Card.SuitCount = {};
    let cards = [];
    let longestSuit = "";
    let longestLengde = 0;
    let level = 0;

    if (cardio) cards = cardio;
    else cards = this._kort;

    for (let i = 0; i < cards.length; i++) {
      let card = cards[i];
      let rank = card.poeng;
      let suit = card.farge;

      // Tell poengene for honnørkortene, hvor ess = 4, konge = 3, dame = 2 og knekt = 1
      if (rank >= 11) {
        points += rank - 10;
      }

      // Hold oversikt over antall kort i hver farge
      if (suit in suits) {
        suits[suit]++;
      } else {
        suits[suit] = 1;
      }
    }

    /* Legg til poeng for langfarger basert på reglene for naturlig system */

    /* Lettere å lese det slik: */
    let fpo = 0;
    Object.keys(suits).forEach((key) => {
      if (suits[key] === 0) fpo += 3;
      else if (suits[key] === 1) fpo += 2;
      else if (suits[key] === 2) fpo += 1;
      //console.log(`Fargen ${key} øker med ${fpo} foredelingspoeng`);
    });
    points += fpo;

    // Bestem åpningsmeldingen basert på poengsummen

    if (points >= 13) {
      if (points >= 16) return "1 NT";

      /*
          let longestSuit = Object.keys(suits).reduce((a,b) => suits[a] > suits[b] ? a : b);
          */
      // Løkke med "for" gjør det samme, men enklere på lese
      for (const suit of Object.keys(suits)) {
        if (suits[suit] > longestLengde) {
          longestLengde = suits[suit];
          longestSuit = suit;
        }
      }
      // console.log(`Poeng på hånda: ${points}!`);
      return "1 " + longestSuit;
    }
    // console.log(`Poeng på hånda: ${points}!`);
    return "Pass";
  }
}

// Spiller.ts

// import { Card, Suit } from "./Card";

// interface Player {
//   name: string;
//   hand: Card[];
// }

// class BridgePlayer {
//   private name: string;
//   private hand: Card[];

//   constructor(name: string) {
//     this.name = name;
//     this.hand = [];
//   }

//   receiveCard(card: Card) {
//     this.hand.push(card);
//   }

//   showHand() {
//     console.log(`${this.name}'s hand:`);
//     this.hand.forEach((card) => {
//       console.log(`${card.rank} of ${card.suit}`);
//     });
//   }
// }

// export { BridgePlayer };
