"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KortStokk = exports.BridgeKort = exports.SpillKort = void 0;
let values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
;
let farger = ["Klover", "Ruter", "Hjerter", "Spar"];
class SpillKort {
    constructor(n, f) {
        this._poeng = n;
        this._farge = f;
    }
    get poeng() {
        return this._poeng;
    }
    set poeng(p) {
        this._poeng = p;
    }
    get farge() {
        return this._farge;
    }
    set farge(f) {
    }
}
exports.SpillKort = SpillKort;
class BridgeKort extends SpillKort {
}
exports.BridgeKort = BridgeKort;
class KortStokk {
    constructor() {
        this.kortstokk = this.shuffle_cards(this.getDeck());
    }
    getDeck() {
        let deck = [];
        for (const i of farger) {
            console.log("Skriver fargen " + i);
            for (let x = 0; x < values.length; x++) {
                let bkBridgeKort = new BridgeKort(values[x], i);
                deck.push(bkBridgeKort);
            }
        }
        return deck;
    }
    shuffle_cards(cards) {
        // Fisher-Yates algorithm for å stokke kortene helt rettferdig
        for (let i = cards.length - 1; i > 0; i--) {
            let til = Math.random();
            const j = Math.floor(til * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        return cards;
    }
}
exports.KortStokk = KortStokk;
//# sourceMappingURL=Card.js.map