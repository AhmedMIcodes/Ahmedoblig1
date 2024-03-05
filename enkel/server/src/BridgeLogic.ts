import { BridgeSpiller, Plass } from "./Spiller"; // Import the missing 'Plass' member

export function handleBid(spiller: BridgeSpiller, bud: string): string {
  // Implement logic to handle the bid and return appropriate response
  // This can include checking if the bid is valid, updating the bidding status, etc.
  return `Spiller ${spiller.plass} melder: ${bud}`;
}

export function respondToBid(spiller: BridgeSpiller, bud: string): string {
  // Implement logic to respond to the bid and return appropriate response
  // This can include determining the next bid or passing, updating the bidding status, etc.
  return `Spiller ${spiller.plass} svarer: ${bud}`;
}
