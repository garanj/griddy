/**
 * Represents a single cell in the grid.
 */
class QueryGridCell {
  /**
   * @param {number} rowIndex The vertical position of the cell in the grid.
   * @param {number} colIndex The horizontal position of the cell in the grid.
   * @param {!QueryGrid} grid The parent grid.
   * @param {string=} optLastColor The last color of the cell at this position,
   *     for use in creating a transition.
   */
  constructor(rowIndex, colIndex, grid, optLastColor) {
    this.rowIndex_ = rowIndex;
    this.colIndex_ = colIndex;
    this.queryCursor_ = 0;
    this.grid_ = grid;
    this.lastColor_ = optLastColor || grid.getNextColor();
    this.backgroundColor_ = grid.getNextColor();
    this.running_ = false;
    this.direction_ = Math.floor(Math.random() * 4);
    this.createElement_();
  }

  /**
   * Transitions from the last color then starts typing.
   */
  start() {
    if (!this.running_) {
      this.running_ = true;
      this.query_ = this.grid_.getNextQuery();
      this.transition().then(() => {
        this.cellElement_.style.backgroundPosition = this.createTransition();
        this.typeCharacter();
      });
    }
  }

  /**
   * Creates the color transition CSS position.
   *
   * @return {string} CSS background position.
   */
  createTransition() {
    if (this.direction_ === 0) {
      return '100% 0%';
    } else if (this.direction_ === 1) {
      return '-100% 0%';
    } else if (this.direction_ === 2) {
      return '0% -100%';
    } else if (this.direction_ === 3) {
      return '0% 100%';
    }
  }

  /**
   * Stops the cell from typing.
   */
  stop() {
    this.running_ = false;
  }

  /**
   * Pause before transitioning color.
   *
   * @return {!Promise} A promise that resolves after 10 ms.
   */
  transition() {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 10);
    });
  }

  /**
   * Types a single character in the cell. If the query is complete, stops the
   * cell and triggers the creation of a replacement.
   */
  typeCharacter() {
    if (this.running_) {
      this.queryCursor_++;
      this.textElement_.innerHTML = this.query_.substring(0, this.queryCursor_);
      if (this.queryCursor_ > this.query_.length) {
        this.stop();
        this.grid_.createNewCell(this.rowIndex_, this.colIndex_);
      } else {
        this.typeDelay().then(this.typeCharacter.bind(this));
      }
    }
  }

  /**
   * Creates a promise that resolves after a random period, to simulate typing.
   *
   * @return {!Promise}
   */
  typeDelay() {
    const typingSpeed = this.grid_.getTypingSpeed();
    const delay = 100 * (Math.random() * typingSpeed + typingSpeed);
    return new Promise((resolve, reject) => {
      setTimeout(resolve, delay);
    });
  }

  /**
   * Retrieves the background color.
   *
   * @return {string} The background color.
   */
  getBackgroundColor() {
    return this.backgroundColor_;
  }

  /**
   * Retrieves the DOM Element for this cell.
   *
   * @return {!Element} The element.
   */
  getElement() {
    return this.cellElement_;
  }

  /**
   * Creates a new Element in the DOM for this cell.
   */
  createElement_() {
    const cellElement = document.createElement('div');
    cellElement.classList.add('grid-cell');
    cellElement.style.backgroundColor = this.getBackgroundColor();
    cellElement.id = 'grid-cell-' + this.rowIndex_ + '-' + this.colIndex_;

    if (this.direction_ === 0) {
      cellElement.style.backgroundSize = '200% 100%';
      cellElement.style.backgroundImage = 'linear-gradient(to left, ' +
          this.getBackgroundColor() + ' 50%, ' + this.lastColor_ + ' 50%)';
    } else if (this.direction_ === 1) {
      cellElement.style.backgroundSize = '200% 100%';
      cellElement.style.backgroundImage = 'linear-gradient(to right, ' +
          this.lastColor_ + ' 50%, ' + this.getBackgroundColor() + ' 50%)';
    } else if (this.direction_ === 2) {
      cellElement.style.backgroundSize = '100% 200%';
      cellElement.style.backgroundImage = 'linear-gradient(to bottom, ' +
          this.lastColor_ + ' 50%, ' + this.getBackgroundColor() + ' 50%)';
    } else if (this.direction_ === 3) {
      cellElement.style.backgroundSize = '100% 200%';
      cellElement.style.backgroundImage = 'linear-gradient(to top, ' +
          this.getBackgroundColor() + ' 50%, ' + this.lastColor_ + ' 50%)';
    }
    const textContainer = document.createElement('div');
    textContainer.classList.add('grid-cell-text');

    const textElement = document.createElement('span');
    textContainer.appendChild(textElement);
    const flashElement = document.createElement('span');
    flashElement.classList.add('flash-cursor');
    flashElement.innerHTML = '|';
    textContainer.appendChild(flashElement);

    cellElement.appendChild(textContainer);
    this.textElement_ = textElement;
    this.cellElement_ = cellElement;
  }
}

export {QueryGridCell};
