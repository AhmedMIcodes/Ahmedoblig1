"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgeSpiller = exports.Plass = void 0;
//Spiller, så enkelt som mulig
var Plass;
(function (Plass) {
    Plass[Plass["Uplassert"] = 0] = "Uplassert";
    Plass[Plass["Nord"] = 1] = "Nord";
    Plass[Plass["Ost"] = 2] = "Ost";
    Plass[Plass["Syd"] = 3] = "Syd";
    Plass[Plass["Vest"] = 4] = "Vest";
})(Plass || (exports.Plass = Plass = {}));
;
class BridgeSpiller {
    constructor(p, k) {
        this._kort = [];
        this.plass = Plass.Uplassert;
        this._kort = k; //this.trettenkort(k.kortstokk); 
        this.plass = p;
    }
    get kort() {
        return this._kort;
    }
    // Kommer tilbake til hvorfor dette ikke virker
    // trettenkort = (k: BridgeKort[]) => { if (k) return k.slice(0,13); else return k;};   
    opening_tellPoengOgMeld(cardio) {
        let points = 0;
        let suits = {};
        let cards = [];
        let longestSuit = "";
        let longestLengde = 0;
        let level = 0;
        if (cardio)
            cards = cardio;
        else
            cards = this._kort;
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
            }
            else {
                suits[suit] = 1;
            }
        }
        /* Legg til poeng for langfarger basert på reglene for naturlig system */
        /* Lettere å lese det slik: */
        let fpo = 0;
        Object.keys(suits).forEach((key) => {
            if (suits[key] === 0)
                fpo += 3;
            else if (suits[key] === 1)
                fpo += 2;
            else if (suits[key] === 2)
                fpo += 1;
            //console.log(`Fargen ${key} øker med ${fpo} foredelingspoeng`);
        });
        points += fpo;
        // Bestem åpningsmeldingen basert på poengsummen
        if (points >= 13) {
            if (points >= 16)
                return "1 NT";
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
    ;
}
exports.BridgeSpiller = BridgeSpiller;
//# sourceMappingURL=Spiller.js.map