/**
 * An object used to provide the means to cancel Promises (or at least stop them
 * resolving). Used for cancelling the timers that periodically check
 * spreadsheets.
 * @class
 */
class TimerPromiseCancel {
  /**
   * Constructor.
   */
  constructor() {
    this.cancelled_ = false;
  }

  /**
   * Sets as cancelled.
   */
  cancel() {
    this.cancelled_ = true;
  }

  /**
   * Deternines whether this is cancelled.
   * @return {boolean} True if cancelled.
   */
  isCancelled() {
    return this.cancelled_;
  }
}

export {TimerPromiseCancel};
