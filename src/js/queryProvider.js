/**
 * A class to provide queries one-by-one, for use in the displayed grid.
 */
class QueryProvider {
  /**
   * Creates a new QueryProvider.
   *
   * @param {!Array.<string>} queryList A list of queries.
   */
  constructor(queryList) {
    this.queryList_ = queryList;
    this.index_ = 0;
  }

  /**
   * Retrieves the next query.
   *
   * @return {string} The next query.
   */
  next() {
    const query = this.queryList_[this.index_];
    this.index_ = (this.index_ + 1) % this.queryList_.length;
    return query;
  }

  /**
   * Creates a QueryProvider from a Spreadsheet returned from the Sheets API.
   *
   * @param {!Object} spreadsheet The object returned from the Sheets API.
   * @return {!QueryProvider} The QueryProvider.
   */
  static createFromSpreadsheet(spreadsheet) {
    const sheets = spreadsheet.result.sheets;
    const querySet = new Set();

    for (const sheet of sheets) {
      if (sheet.data) {
        const values = sheet.data[0].rowData;

        for (const row of values) {
          if (row.values) {
            querySet.add(row.values[0].formattedValue);
          }
        }
      }
    }
    return new QueryProvider(Array.from(querySet));
  }
}

export {QueryProvider};
