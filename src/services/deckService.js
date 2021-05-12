const { GoogleSpreadsheet } = require("google-spreadsheet");
const JsonStorageService = require("./jsonStorageService");
const Config = require("../config/config.js");

class DeckService {

  constructor(spreadsheetConfig) {
    const deckNameTable = { startRow: 80, endRow: 140 }
    this.doc = new GoogleSpreadsheet(spreadsheetConfig.spreadsheet_id);
    const { client_email, private_key } = spreadsheetConfig;
    this.creds = { client_email, private_key };
    this.jsonDataService = new JsonStorageService("deck-names.json");
    this.workingSheet = null;
    this.deckNameTable = { startRow: 80, endRow: 180, startColumn:"B", endColumn:"C" }
    //matchLogTable
  }

  initialize = async () => {
    await this.doc.useServiceAccountAuth(this.creds);
    await this.doc.loadInfo();
    await this.jsonDataService.initialize();
    this.workingSheet = this.doc.sheetsByIndex[0];
    await this.workingSheet.loadCells("B80:C180");
    await this.workingSheet.loadCells("H4:H520");
  };

  addDeck = async (deckName) => {
    const idOfDeck = this._getIdOfDeck(deckName);
    let deckDisplayName = this._getNameOfDeck(this.workingSheet, this.deckNameTable, idOfDeck);
    if (!deckDisplayName) {
      await this._saveNameOfDeck(this.workingSheet, this.deckNameTable, idOfDeck, deckName);
      deckDisplayName = deckName;
    }
    const emptyCell = await this._findFirstEmptyCellInColumn(this.workingSheet, "H", 4, 520);
    emptyCell.value = deckDisplayName;
    await this.workingSheet.saveUpdatedCells();
    return deckDisplayName;
  };

  _getIdOfDeck = (deckNameInput) => {
    return deckNameInput.toLowerCase().split(" ").join("");
  }

  _getNameOfDeck = (sheet, deckNameTable, deckId) => {
    for (let i = deckNameTable.startRow; i <= deckNameTable.endRow; i++) {
      const cell = sheet.getCellByA1(`${deckNameTable.startColumn}${i}`);
      if (!cell.value || cell.value === "") {
        return null;
      }
      if (cell.value == deckId){
        return sheet.getCellByA1(`${deckNameTable.endColumn}${i}`).value;
      }
    }
    return null;
  }

  _saveNameOfDeck = async (sheet, deckNameTable, deckId, deckName) => { 
    const idCell = await this._findFirstEmptyCellInColumn(sheet, deckNameTable.startColumn, deckNameTable.startRow, deckNameTable.endRow);
    idCell.value = deckId;
    const nameCell = sheet.getCellByA1(`${deckNameTable.endColumn}${idCell.a1Row}`);
    nameCell.value = deckName;
    await sheet.saveUpdatedCells();
  }
  
  _findFirstEmptyCellInColumn = async (sheet, columnLetter, startRow, endRow) => {
    for (let i = startRow; i <= endRow; i++) {
      const cell = sheet.getCellByA1(`${columnLetter}${i}`);
      if (!cell.value || cell.value === "") {
        return cell;
      }
    }
    return null;
  };

  _getColumnCells = async (sheet, columnLetter, startRow, endRow) => {
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
