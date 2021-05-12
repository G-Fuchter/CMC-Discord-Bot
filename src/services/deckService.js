const { GoogleSpreadsheet } = require("google-spreadsheet");
const JsonStorageService = require("./jsonStorageService");
const Config = require("../config/config.js");

class DeckService {
  constructor(spreadsheetConfig) {
    this.doc = new GoogleSpreadsheet(spreadsheetConfig.spreadsheet_id);
    const { client_email, private_key } = spreadsheetConfig;
    this.creds = { client_email, private_key };
    this.jsonDataService = new JsonStorageService("deck-names.json");
  }

  initialize = async () => {
    await this.doc.useServiceAccountAuth(this.creds);
    await this.doc.loadInfo();
    await this.jsonDataService.initialize();
  };

  addDeck = async (deckName) => {
    const idOfDeck = this._getIdOfDeck(deckName);
    let deckDisplayName = this.jsonDataService.getObjectWithId(idOfDeck)?.displayName ?? null;
    if (!deckDisplayName) {
      this.jsonDataService.saveObject({id: idOfDeck, displayName: deckName});
      deckDisplayName = deckName;
    }

    const sheet = this.doc.sheetsByIndex[0];
    const emptyCell = await this._findFirstEmptyCellInColumn(sheet, "H", 4, 520);
    emptyCell.value = deckDisplayName;
    await sheet.saveUpdatedCells();
    return deckDisplayName;
  };

  _getIdOfDeck = (deckName) => {
    return deckName.toLowerCase().split(" ").join("");
  }

  _findFirstEmptyCellInColumn = async (sheet, columnLetter, startRow, endRow) => {
    await sheet.loadCells(`${columnLetter}${startRow}:${columnLetter}${endRow}`);
    for (let i = startRow; i <= endRow; i++) {
      const cell = sheet.getCellByA1(`${columnLetter}${i}`);
      if (!cell.value || cell.value === "") {
        return cell;
      }
    }
    return null;
  };

  _getColumnCells = async (sheet, columnLetter, startRow, endRow) => {
    await sheet.loadCells(`${columnLetter}${startRow}:${columnLetter}${endRow}`);
    const cells = [];
    for (let i = startRow; i <= endRow; i++) {
      cells.push(sheet.getCellByA1(`${columnLetter}${i}`));
    }
    return cells;
  };

  checkDecks = async () => {
    const sheet = this.doc.sheetsByIndex[0];

    await sheet.loadCells("O4:O80");
    await sheet.loadCells("X4:X80");

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
    return discordMessage;
  };
}
const deckService = new DeckService(Config.spreadsheet);
deckService.initialize();
module.exports = deckService;
