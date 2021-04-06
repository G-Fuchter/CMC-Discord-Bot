const { GoogleSpreadsheet } = require("google-spreadsheet");
const Config = require("../config/config.json");

class DeckService {
  constructor(spreadsheetConfig) {
    this.doc = new GoogleSpreadsheet(spreadsheetConfig.spreadsheet_id);
    const { client_email, private_key } = spreadsheetConfig;
    this.creds = { client_email, private_key };
  }

  initialize = async () => {
    await this.doc.useServiceAccountAuth(this.creds);
    await this.doc.loadInfo();
    console.log(this.doc.title);
  };

  addDeck = async (deckName) => {
    const sheet = this.doc.sheetsByIndex[0];
    await sheet.loadCells("H4:H520");
    const cells = [];
    for (let i = 4; i < 100; i++) {
      //cells.push(sheet.getCellByA1(`H${i}`));
      if (!sheet.getCellByA1(`H${i}`)._rawData.formattedValue) {
        console.log(i-1);
        return i;
      }
    }
    //console.log(sheet.cellStats); why do this?
    await sheet; //???
  };

  checkDecks = async () => {
    const sheet = this.doc.sheetsByIndex[0];

    await sheet.loadCells("O4:O80");
    await sheet.loadCells("X4:X80");
    //console.log("cells loaded correctly");

    //SHOWS DECKS IN an array in discordMessage with their respective number and meta%
    let discordMessage = "";

    for (let i = 4; i < 14; i++) {
      const currentDeckCell = sheet.getCellByA1(`O${i}`)._rawData
        .formattedValue;
      const currentDeckPercentage = sheet.getCellByA1(`X${i}`)._rawData
        .formattedValue;
      if (!currentDeckCell) {
        break;
      }

      discordMessage =
        discordMessage +
        (i -
          3 +
          "." +
          " " +
          currentDeckPercentage +
          " " +
          currentDeckCell +
          "\n");
    }

    //console.log(discordMessage);
    return discordMessage;
    /*
    SHOWS DECKS IN decks ARRAY
    const decks = [];
    for (let i = 4; i < 20; i++) {
      const currentDeckCell = sheet.getCellByA1(`O${i}`)._rawData
        .formattedValue;

      if (!currentDeckCell) {
        break;
      }

      decks.push(currentDeckCell);
    }
    console.log(decks); */
  };
}
const deckService = new DeckService(Config.spreadsheet);
deckService.initialize();
module.exports = deckService;
