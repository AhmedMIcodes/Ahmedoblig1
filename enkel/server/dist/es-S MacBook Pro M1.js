"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Library imports.
const express_1 = __importDefault(require("express"));
const Spiller = __importStar(require("./Spiller"));
const Card_1 = require("./Card");
//Vi lager "vår" express app
const app = (0, express_1.default)();
//Gjør det slik at vi forstår JSON
app.use(express_1.default.json());
// Senker sikkerhetsnivåene slik at vi kan teste dette
app.use(function (inRequest, inResponse, inNext) {
    inResponse.header("Access-Control-Allow-Origin", "*");
    inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    inNext();
});
class BridgeBord {
    constructor() {
        this.k = new Card_1.KortStokk();
        this.spillere = [
            new Spiller.BridgeSpiller(Spiller.Plass.Nord, this.k.kortstokk.slice(0, 13)),
            new Spiller.BridgeSpiller(Spiller.Plass.Ost, this.k.kortstokk.slice(13, 26)),
            new Spiller.BridgeSpiller(Spiller.Plass.Syd, this.k.kortstokk.slice(26, 39)),
            new Spiller.BridgeSpiller(Spiller.Plass.Vest, this.k.kortstokk.slice(39, 52))
        ];
    }
}
let bridgebordet = null;
//Må ha med én POST-rutine, syns jeg
app.post("/arrive", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("POST /arrive: Ok");
        let outstr = "";
        bridgebordet = new BridgeBord();
        for (const spiller of bridgebordet.spillere) {
            outstr += "Spiller plass: " + spiller.plass + "\n";
            console.log(outstr);
            if (spiller.kort)
                for (const kortet of spiller.kort) {
                    outstr += "P: " + kortet.poeng + " F: " + kortet.farge + "\n";
                    console.log(outstr);
                }
        }
        inResponse.send(`<html><head></head><body> 
        <div> Har initialisert bridgebordet! </div>
        <div> ${outstr} <\div>
        </body></html>`);
    }
    catch (inError) {
        console.log("POST /arrive: Error", inError);
        inResponse.send("<html><head></head><body> Dette gikk ikke så fint! </body></html>");
    }
}));
app.get('/ready', (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("GET /ready: Ok");
        inResponse.send("<html><head></head><body> Dette gikk fint! </body></html>");
    }
    catch (inError) {
        console.log("GET /ready: Error", inError);
        inResponse.send("<html><head></head><body> Dette gikk ikke så fint! </body></html>");
    }
}));
app.put('/start', (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    if (bridgebordet)
        try { //opening_tellPoengOgMeld
            console.log("PUT /start: OK");
            let outstr = "";
            for (const spiller of bridgebordet.spillere) {
                //console.log(outstr); 
                if (spiller.kort)
                    outstr += "Spiller " + spiller.plass
                        + " melder: "
                        + spiller.opening_tellPoengOgMeld()
                        + "\n";
            }
            inResponse.send(`<html><head></head><body> 
            <div> meldt en runde: </div>    
            <div> \n${outstr} <\div>
            </body></html>`);
        }
        catch (inError) {
            console.log("PUT /start: Error", inError);
            inResponse.send("<html><head></head><body> Dette gikk ikke så fint! </body></html>");
        }
    else
        inResponse.send("<html><head></head><body> Mangler faktisk hele bordet! </body></html>");
}));
app.delete('/leave', (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("DELETE /leave: Ok");
        inResponse.send("<html><head></head><body> Dette gikk fint! </body></html>");
    }
    catch (inError) {
        console.log("DELETE /leave: Error", inError);
        inResponse.send("<html><head></head><body> Dette gikk ikke så fint! </body></html>");
    }
}));
app.listen(8080, () => {
    console.log("Serveren lytter på port 8080");
});
//# sourceMappingURL=es.js.map