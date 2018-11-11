import {OfflineQueryProvider} from './offlineQueryProvider';
import {QueryGridCell} from './queryGridCell';

/**
 * @fileoverview Represents the grid of queries running in the browser.
 */
const DEFAULT_COLORS = ['#4285F4', '#0F9D58', '#F4B400', '#DB4437'];
const OFFLINE_COLORS = ['Grey', 'DarkGrey', 'LightGrey', 'WhiteSmoke'];

/**
 * Represents the grid of queries running in the browser.
 */
class QueryGrid {
  /**
   * @constructor
   * @param {number} numRows The number of rows in the grid.
   * @param {number} numCols The number of columns in the grid.optColors
   * @param {number} typingSpeed Base milliseconds between keystrokes.
   * @param {?QueryProvider=} optQueryProvider Provider of search queries.
   * @param {?Array.<string>=} optColors Optional list of HTML colours.
   */
  constructor(numRows, numCols, typingSpeed, optQueryProvider, optColors) {
    this.typingSpeed_ = typingSpeed;
    this.queryProvider_ = optQueryProvider;
    this.offlineQueryProvider_ = new OfflineQueryProvider();
    this.colors_ = optColors || DEFAULT_COLORS;
    this.running_ = false;
    this.isOnline_ = navigator.onLine;
    this.setSize(numRows, numCols);
    this.startAll();
  }

  /**
   * Sets the size of the grid.
   *
   * @param {number} numRows The number of rows in the grid.
   * @param {number} numCols The number of columns in the grid.
   */
  setSize(numRows, numCols) {
    this.numRows_ = numRows;
    this.numCols_ = numCols;
    const gridContainer = document.getElementById('grid-container');
    const clientWidth = gridContainer.clientWidth;
    const clientHeight = gridContainer.clientHeight;
    document.documentElement.style.setProperty('--grid-cell-font-size',
        Math.floor(20 / Math.max(this.numRows_, this.numCols_)) + 'vmin');
    document.documentElement.style.setProperty('--grid-cell-width',
        (clientWidth / this.numCols_).toFixed(2) + 'px');
    document.documentElement.style.setProperty('--grid-cell-height',
        (clientHeight / this.numRows_).toFixed(2) + 'px');

    this.createGridArray_();
    this.createGridElement_();
  }

  /**
   * Resizes the grid, pausing the display if necessary.
   *
   * @param {number} numRows The number of rows in the grid.
   * @param {number} numCols The number of columns in the grid.
   */
  resize(numRows, numCols) {
    let pauseResume = false;
    if (this.running_) {
      this.stopAll_();
      pauseResume = true;
    }
    this.setSize(numRows, numCols);
    if (pauseResume) {
      this.startAll();
    }
  }

  /**
   * Sets the typing speed.
   *
   * @param {number} typingSpeed The typing speed.
   */
  setTypingSpeed(typingSpeed) {
    this.typingSpeed_ = typingSpeed;
  }

  /**
   * Retrieves the typing speed.
   *
   * @return {number} The typing speed.
   */
  getTypingSpeed() {
    return this.typingSpeed_;
  }

  /**
   * Sets the query provider.
   *
   * @param {!QueryProvider} queryProvider The new query provider.
   */
  setQueryProvider(queryProvider) {
    this.queryProvider_ = queryProvider;
  }

  /**
   * Retrieves the query provider.
   *
   * @return {!QueryProvider} The query provider..
   */
  getQueryProvider() {
    return this.queryProvider_;
  }

  /**
   * Retrieves the next query from the provider.
   *
   * @return {string} The next query.
   */
  getNextQuery() {
    if (!this.isOnline_) {
      return this.offlineQueryProvider_.next();
    }
    return this.queryProvider_.next();
  }

  /**
   * Creates a JS array of QueryGridCell objects to represent the grid.
   */
  createGridArray_() {
    this.cells_ = [];
    for (let i = 0; i < this.numRows_; i++) {
      const row = [];
      for (let j = 0; j < this.numCols_; j++) {
        row.push(new QueryGridCell(i, j, this));
      }
      this.cells_.push(row);
    }
  }

  /**
   * Creates or recreates the element on the page for the grid.
   */
  createGridElement_() {
    const gridDiv = document.getElementById('grid-container');
    while (gridDiv.firstChild) {
      gridDiv.removeChild(gridDiv.firstChild);
    }

    for (let i = 0; i < this.numRows_; i++) {
      for (let j = 0; j < this.numCols_; j++) {
        const cellElement = this.cells_[i][j].getElement();
        gridDiv.appendChild(cellElement);
      }
    }
  }

  /**
   * Starts all cells typing.
   */
  startAll() {
    if (!this.running_) {
      if (this.queryProvider_) {
        for (let i = 0; i < this.numRows_; i++) {
          for (let j = 0; j < this.numCols_; j++) {
            this.cells_[i][j].start();
          }
        }
        this.running_ = true;
      }
    }
  }

  /**
   * Stops all cells typing.
   */
  stopAll_() {
    if (this.running_) {
      for (let i = 0; i < this.numRows_; i++) {
        for (let j = 0; j < this.numCols_; j++) {
          this.cells_[i][j].stop();
        }
      }
      this.running_ = false;
    }
  }

  /**
   * replaces the element at a given position in the grid with a new one.
   *
   * @param {number} rowIndex The row index.
   * @param {number} colIndex The column index.
   */
  createNewCell(rowIndex, colIndex) {
    const oldElement = this.cells_[rowIndex][colIndex].getElement();
    let lastColor;
    if (this.cells_[rowIndex][colIndex]) {
      lastColor = this.cells_[rowIndex][colIndex].getBackgroundColor();
    }
    this.cells_[rowIndex][colIndex] = new QueryGridCell(rowIndex,
        colIndex, this, lastColor);
    const gridDiv = document.getElementById('grid-container');
    const newElement = this.cells_[rowIndex][colIndex].getElement();
    gridDiv.replaceChild(newElement, oldElement);
    this.cells_[rowIndex][colIndex].start();
  }

  /**
   * Gets the next color, provided randonly.
   *
   * @return {string} The next color.
   */
  getNextColor() {
    if (!this.isOnline_) {
      const index = Math.floor(Math.random() * OFFLINE_COLORS.length);
      return OFFLINE_COLORS[index];
    }

    const index = Math.floor(Math.random() * this.colors_.length);
    return this.colors_[index];
  }

  /**
   * Updates the online status.
   *
   * @param {boolean} status True if online.
   */
  setOnlineStatus(status) {
    if (status !== this.isOnline_) {
      this.isOnline_ = status;
      this.resize(this.numRows_, this.numCols_);
    }
  }
}

export {QueryGrid};
