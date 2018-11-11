/**
 * This query provider is used when offline to provide text queries with that
 * message.
 */
class OfflineQueryProvider {
  /**
   * Constructor.
   */
  constructor() {
    this.queryList_ = [
      'There is no internet connection',
      'Try checking the network connection',
      'Try reconnecting to Wi-Fi',
      ':-( :-(',
    ];
    this.index_ = 0;
  }

  /**
   * Retrieves the next query.
   *s
   * @return {string} The next query.
   */
  next() {
    const query = this.queryList_[this.index_];
    this.index_ = (this.index_ + 1) % this.queryList_.length;
    return query;
  }
}

export {OfflineQueryProvider};
