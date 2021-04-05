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
      cells.push(sheet.getCellByA1(`H${i}`));
    }
    console.log(sheet.cellStats);
    await sheet
  };
}

const deckService = new DeckService(Config.spreadsheet);
deckService.initialize();

module.exports = deckService;
