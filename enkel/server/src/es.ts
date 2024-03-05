// Enkel server, snart
import path from "path";

// Library imports.
import express, { Express, NextFunction, Request, Response } from "express";

import * as Spiller from "./Spiller";
import { KortStokk } from "./Card";

import { BridgeSpiller, Plass } from "./Spiller";
import { handleBid, respondToBid } from "./BridgeLogic";

//Vi lager "vår" express app
const app: Express = express();

// Other middleware and configuration
app.post("/bid", async (req: Request, res: Response) => {
  try {
    const { plass, bud } = req.body;
    const spiller = new BridgeSpiller(plass, []);
    const response = handleBid(spiller, bud);
    res.json({ message: response });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/respond", async (req: Request, res: Response) => {
  try {
    const { plass, bud } = req.body;
    const spiller = new BridgeSpiller(plass, []);
    const response = respondToBid(spiller, bud);
    res.json({ message: response });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/start", async (req: Request, res: Response) => {
  try {
    console.log("PUT /start: OK");
    let outstr: string = "";
    if (bridgebordet) {
      for (const spiller of bridgebordet.spillere) {
        outstr += "Spiller " + spiller.plass + " melder: ";
        if (spiller.plass === Plass.Nord || spiller.plass === Plass.Syd) {
          const bud = await makeBid(spiller); // Assuming makeBid is a function to make a bid
          outstr += handleBid(spiller, bud);
        } else {
          // Assuming receiveBid is a function to receive bid from other players
          const bud = await receiveBid(spiller);
          outstr += respondToBid(spiller, bud);
        }
        outstr += "\n";
      }
    }
    res.send(`<html><head></head><body> 
            <div> meldt en runde: </div>    
            <div> \n${outstr} <\div>
            </body></html>`);
  } catch (error) {
    console.log("PUT /start: Error", error);
    res.status(500).send("Internal Server Error");
  }
});

async function makeBid(spiller: BridgeSpiller): Promise<string> {
  // Implement logic for the player to make a bid
  // This can include interacting with the player, receiving input, etc.
  // For simplicity, we'll return a hardcoded bid for now
  return "1H";
}

async function receiveBid(spiller: BridgeSpiller): Promise<string> {
  // Implement logic for the player to receive bid from other players
  // This can include interacting with the player, receiving input, etc.
  // For simplicity, we'll return a hardcoded bid for now
  return "1S";
}
//Gjør det slik at vi forstår JSON
app.use(express.json());

// Senker sikkerhetsnivåene slik at vi kan teste dette
app.use(function (
  inRequest: Request,
  inResponse: Response,
  inNext: NextFunction
) {
  inResponse.header("Access-Control-Allow-Origin", "*");
  inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  inResponse.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  inNext();
});

class BridgeBord {
  k: KortStokk = new KortStokk();
  spillere: Spiller.BridgeSpiller[] = [
    new Spiller.BridgeSpiller(
      Spiller.Plass.Nord,
      this.k.kortstokk.slice(0, 13)
    ),
    new Spiller.BridgeSpiller(
      Spiller.Plass.Ost,
      this.k.kortstokk.slice(13, 26)
    ),
    new Spiller.BridgeSpiller(
      Spiller.Plass.Syd,
      this.k.kortstokk.slice(26, 39)
    ),
    new Spiller.BridgeSpiller(
      Spiller.Plass.Vest,
      this.k.kortstokk.slice(39, 52)
    ),
  ];
}

let bridgebordet: BridgeBord | null = null;

//Må ha med én POST-rutine, syns jeg
app.post("/arrive", async (inRequest: Request, inResponse: Response) => {
  try {
    console.log("POST /arrive: Ok");
    let outstr: string = "";
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
  } catch (inError) {
    console.log("POST /arrive: Error", inError);
    inResponse.send(
      "<html><head></head><body> Dette gikk ikke så fint! </body></html>"
    );
  }
});

app.get("/ready", async (inRequest: Request, inResponse: Response) => {
  try {
    console.log("GET /ready: Ok");
    inResponse.send(
      "<html><head></head><body> Dette gikk fint! </body></html>"
    );
  } catch (inError) {
    console.log("GET /ready: Error", inError);
    inResponse.send(
      "<html><head></head><body> Dette gikk ikke så fint! </body></html>"
    );
  }
});

app.put("/start", async (inRequest: Request, inResponse: Response) => {
  if (bridgebordet)
    try {
      //opening_tellPoengOgMeld
      console.log("PUT /start: OK");
      let outstr: string = "";
      for (const spiller of bridgebordet.spillere) {
        //console.log(outstr);
        if (spiller.kort)
          outstr +=
            "Spiller " +
            spiller.plass +
            " melder: " +
            spiller.opening_tellPoengOgMeld() +
            "\n";
      }
      inResponse.send(`<html><head></head><body>
            <div> meldt en runde: </div>
            <div> \n${outstr} <\div>
            </body></html>`);
    } catch (inError) {
      console.log("PUT /start: Error", inError);
      inResponse.send(
        "<html><head></head><body> Dette gikk ikke så fint! </body></html>"
      );
    }
  else
    inResponse.send(
      "<html><head></head><body> Mangler faktisk hele bordet! </body></html>"
    );
});

app.delete("/leave", async (inRequest: Request, inResponse: Response) => {
  try {
    console.log("DELETE /leave: Ok");
    inResponse.send(
      "<html><head></head><body> Dette gikk fint! </body></html>"
    );
  } catch (inError) {
    console.log("DELETE /leave: Error", inError);
    inResponse.send(
      "<html><head></head><body> Dette gikk ikke så fint! </body></html>"
    );
  }
});

app.listen(8080, () => {
  console.log("Serveren lytter på port 8080");
});

// es.ts

// import express, { Express, Request, Response } from "express";
// import { Card, Suit } from "./Card";

// const app: Express = express();
// app.use(express.json());

// class BridgeGame {
//   deck: Card[] = [];
//   players: string[] = [];

//   constructor() {
//     this.createDeck();
//   }

//   createDeck() {
//     const suits: Suit[] = [Suit.SPADES, Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS];
//     for (let rank = 2; rank <= 14; rank++) {
//       suits.forEach((suit) => {
//         this.deck.push({ rank, suit });
//       });
//     }
//   }

//   initializeGame(playerNames: string[]) {
//     this.players = playerNames;
//     console.log("Game initialized with players:", this.players);
//   }

//   startGame() {
//     console.log("Game started!");
//     console.log("Deck:", this.deck);
//   }
// }

// const bridgeGame = new BridgeGame();

// app.post("/initialize", (req: Request, res: Response) => {
//   const { players } = req.body;
//   bridgeGame.initializeGame(players);
//   res.status(200).send("Game initialized successfully");
// });

// app.post("/start", (req: Request, res: Response) => {
//   bridgeGame.startGame();
//   res.status(200).send("Game started successfully");
// });

// const PORT = 8080;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
