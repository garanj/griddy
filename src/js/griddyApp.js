import {Palettes} from './palettes';
import {QueryGrid} from './queryGrid';
import {QueryProvider} from './queryProvider';
import {TimerPromiseCancel} from './timerPromiseCancel';

import '../css/styles.css';


// OAuth2 settings
const API_KEY = 'GRIDDY_API_KEY';
// eslint-disable-next-line max-len
const CLIENT_ID = 'GRIDDY_CLIENT_ID';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

// Milliseconds between reloading the spreadsheet.
const SPREADSHEET_REFRESH_MS = 5 * 60 * 1000;

// Milliseconds to show the settings buttons for, before hiding again.
const SETTINGS_DISPLAY_TIMEOUT_MS = 2500;

// Milliseconds between OAuth token expiry checks.
const OAUTH_CHECK_MS = 60 * 1000;

// Milliseconds remaining before OAuth token expiry below which to refresh.
const MIN_TOKEN_REMAINING_MS = 5 * 60 * 1000;

// Milliseconds to show snackbars for.
const SNACKBAR_ERR_TIMEOUT_MS = 15000;
const SNACKBAR_TIMEOUT_MS = 3000;

// Default configuration for GriddySheets, which is saved to LocalStorage.
const DEFAULT_CONFIG = {
  numRows: 4,
  numCols: 3,
  typingSpeed: 9,
  documentId: null,
  paletteName: 'Google',
  textColorMode: 'Light',
};

/**
 * Te core object controlling the application.
 */
class GriddyApp {
  /**
   * Constructor
   */
  constructor() {
    this.auth2_ = null;
    this.queryGrid_ = this.createGrid_();
    this.config_ = this.loadConfig_();
    this.queryProvider_ = null;
    this.latestMoveId_ = 0;
    this.settingsContainer_ = document.getElementById('settings-container');
    this.authorizeButton_ = document.getElementById('authorize-button');
    this.signoutButton_ = document.getElementById('signout-button');
    this.fullscreenButton_ = document.getElementById('fullscreen-button');
    this.dialogButton_ = document.getElementById('settings-button');
    this.documentButton_ = document.getElementById('document-button');
    this.currentTimerPromiseCancel_ = null;

    this.addWindowEventListeners_();
    this.addNetworkChangeListeners_();
    this.addSliderEventListeners_();
    this.addColorsTextboxEventListener_();
    this.populatePalettesList_();
    this.addPalettesListListener_();
    this.populateTextMode_();
    this.addTextModeListener_();

    this.createRefreshOAuthTimer_();

    this.initDialog_();

    if (typeof gapi === 'undefined') {
      this.showSnackbar_('Unable to load Google JS library (is you connected?)',
          SNACKBAR_ERR_TIMEOUT_MS);
    } else {
      gapi.load('client:auth2:picker', {
        callback: this.initAuth_.bind(this),
        onerror: () => {
          this.showSnackbar_('gapi.client failed to load!',
              SNACKBAR_ERR_TIMEOUT_MS);
        },
      });
    }
  }

  /**
   * Creates a new Promise that resolves after the SPREADSHEET_REFRESH_MS time
   * period has elapsed, as long as the resolving has not been cancelled.
   *
   * @param {!TimerPromiseCancel} timerPromiseCancel An object that can be set
   *     to stop the Promise from ever resolving.
   * @return {!Promise} The created Promise.
   */
  timerPromise_(timerPromiseCancel) {
    return new Promise((resolve, reject) => {
      /**
       * Resolves only if the Promise has not been cancelled.
       */
      function checkCancelledThenResolve() {
        if (!timerPromiseCancel.isCancelled()) {
          resolve();
        }
      }
      setTimeout(checkCancelledThenResolve, SPREADSHEET_REFRESH_MS);
    });
  }

  /**
   * Writes each property of the default configuration settings to LocalStorage.
   */
  createDefaultConfig_() {
    const keys = Object.keys(DEFAULT_CONFIG);
    for (const key of keys) {
      localStorage.setItem(key, DEFAULT_CONFIG[key]);
    }
  }

  /**
   * Loads the configuration from LocalStorage into the global config variable.
   * If no config is found in LocalStorage, it is created.
   *
   * @return {!Object} The config object.
   */
  loadConfig_() {
    let numRows = localStorage.getItem('numRows');
    if (!numRows) {
      this.createDefaultConfig_();
    }
    numRows = localStorage.getItem('numRows');
    const numCols = localStorage.getItem('numCols');
    const typingSpeed = localStorage.getItem('typingSpeed');
    const documentId = localStorage.getItem('documentId');
    const customColors = localStorage.getItem('customColors');
    const paletteName = localStorage.getItem('paletteName');
    const textColorMode = localStorage.getItem('textColorMode');

    return {
      numRows: numRows,
      numCols: numCols,
      typingSpeed: typingSpeed,
      documentId: documentId,
      customColors: customColors,
      paletteName: paletteName,
      textColorMode: textColorMode,
    };
  }

  /**
   * Waits for Material Design Lite slider components to be fully initialised
   * before resolving, which allows post-initialisation actions, such as setting
   * the slider position value to work.
   *
   * @param {string} sliderId The ID of the HTML slider element.
   * @return {!Promise} The created Promise.
   */
  waitForSlider_(sliderId) {
    return new Promise((resolve, reject) => {
      /**
       * Resolves Promise if slider is initialised, otherwise sets a timer to
       * check again.
       */
      function checkForSlider() {
        const slider = document.getElementById(sliderId);
        if (slider && slider.MaterialSlider) {
          resolve(slider);
        } else {
          setTimeout(checkForSlider, 50);
        }
      }
      checkForSlider();
    });
  }

  /**
   * Creates the object that represents the grid of queries displayed in the
   * window.
   *
   * @return {!QueryGrid} The newly-created grid.
   */
  createGrid_() {
    this.config_ = this.loadConfig_();
    return this.queryGrid_ || new QueryGrid(this.config_.numRows,
        this.config_.numCols, this.config_.typingSpeed,
        this.config_.paletteName, this.config_.customColors,
        this.config_.textColorMode);
  }

  /**
   * Resizes the grid of queries based on the settings in the global config.
   */
  resizeGrid_() {
    this.config_ = this.loadConfig_();
    this.queryGrid_.resize(this.config_.numRows, this.config_.numCols);
  }

  /**
   * Hides the settings and sign-in/out buttons.
   */
  hideSettings_() {
    this.settingsContainer_.classList.add('hidden');
  }

  /**
   * Shows the settings and sign-in/out buttons.
   */
  showSettings_() {
    this.settingsContainer_.classList.remove('hidden');
  }

  /**
   * Creates a Promise which attempts to resolve after
   * SETTINGS_DISPLAY_TIMEOUT_MS milliseconds. It only resolves if no other
   * similar Promises have been created since. This is used to create a Promise
   * which only resolves if the mouse move that created the Promise is the most
   * recent one.
   *
   * @return {!Promise} The created Promise.
   */
  createDisplayPromise_() {
    this.latestMoveId_++;
    const moveId = this.latestMoveId_;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.latestMoveId_ === moveId) {
          resolve();
        } else {
          reject();
        }
      }, SETTINGS_DISPLAY_TIMEOUT_MS);
    });
  }

  /**
   * Toggles between fullscreen and not.
   */
  toggleFullScreen_() {
    const doc = window.document;
    const docEl = doc.documentElement;

    const requestFullScreen = docEl.requestFullscreen ||
        docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen;
    const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    } else {
      cancelFullScreen.call(doc);
    }
  }

  /**
   * Resets the fullscreen icon when exiting fullscreen.
   */
  fullscreenExitHandler_() {
    const textElem = document.getElementById('fullscreen-button-text-element');
    const doc = window.document;
    if (!doc.fullscreenElement && !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      textElem.innerHTML = 'fullscreen';
    } else {
      textElem.innerHTML = 'fullscreen_exit';
    }
  }

  /**
   * Adds event handler.
   */
  addWindowEventListeners_() {
    window.addEventListener('resize', () => {
      this.resizeGrid_();
    });

    window.addEventListener('mousemove', () => {
      this.showSettings_();
      this.createDisplayPromise_()
          .then(() => this.hideSettings_())
          .catch(() => {
            // Do nothing here
          });
    });

    this.authorizeButton_.addEventListener('click', () => this.auth2_.signIn());
    this.signoutButton_.addEventListener('click', () => this.auth2_.signOut());
    this.fullscreenButton_.addEventListener('click', this.toggleFullScreen_);
    this.documentButton_.addEventListener('click', () => this.showPicker_());
    window.addEventListener('webkitfullscreenchange',
        this.fullscreenExitHandler_, false);
  }

  /**
   * Adds event handlers to handle changes to the slider values.
   */
  addSliderEventListeners_() {
    this.waitForSlider_('rowsSlider').then((slider) => {
      slider.addEventListener('change', (event) => {
        localStorage.setItem('numRows', event.target.value);
        this.resizeGrid_();
      });
    });

    this.waitForSlider_('colsSlider').then((slider) => {
      slider.addEventListener('change', (event) => {
        localStorage.setItem('numCols', event.target.value);
        this.resizeGrid_();
      });
    });

    this.waitForSlider_('typingSpeed').then((slider) => {
      slider.addEventListener('change', (event) => {
        localStorage.setItem('typingSpeed', event.target.value);
        this.queryGrid_.setTypingSpeed(event.target.value);
        this.loadConfig_();
      });
    });
  }

  /**
   * Updates the text mode dropdown.
   */
  populateTextMode_() {
    const textModeSelector = document.getElementById('text-mode');
    textModeSelector.value = this.config_.textColorMode || 'Light';
  }

  /**
   * Updates the predefined palettes selector in the settings dialog.
   */
  populatePalettesList_() {
    const paletteSelector = document.getElementById('palettes');
    const paletteName = this.config_.paletteName;
    const paletteNames = Palettes.getPaletteNames();
    for (const name of paletteNames) {
      const opt = document.createElement('option');
      if (paletteName === name) {
        opt.setAttribute('selected', '');
      }
      opt.value = name;
      opt.text = name;
      paletteSelector.add(opt);
    }
    this.setCustomColorsVisibilty_();
  }

  /**
   * Sets whether the custom colors text box should be visible.
   */
  setCustomColorsVisibilty_() {
    const customColors = document.getElementById('colors-div');
    if (this.config_.paletteName === '<Custom>') {
      customColors.classList.remove('hidden');
    } else {
      customColors.classList.add('hidden');
    }
  }

  /**
   * Adds a listener for changes to the color palette selector.
   */
  addPalettesListListener_() {
    const paletteSelector = document.getElementById('palettes');

    paletteSelector.addEventListener('change', (event) => {
      this.config_.paletteName = event.target.value;
      this.setCustomColorsVisibilty_();
      localStorage.setItem('paletteName', this.config_.paletteName);
      this.queryGrid_.setColors(this.config_.paletteName,
          this.config_.customColors);
    });
  }

  /**
   * Adds a listener for changes to the text mode selector.
   */
  addTextModeListener_() {
    const textModeSelector = document.getElementById('text-mode');

    textModeSelector.addEventListener('change', (event) => {
      this.config_.textColorMode = event.target.value;
      localStorage.setItem('textColorMode', this.config_.textColorMode);
      this.queryGrid_.setTextMode(event.target.value);
    });
  }

  /**
   * Adds a listener for changes to the custom color text field.
   */
  addColorsTextboxEventListener_() {
    const customColors = document.getElementById('colors-text-field');

    customColors.value = this.config_.customColors || '';
    customColors.addEventListener('change', (event) => {
      this.config_.customColors = event.target.value;
      localStorage.setItem('customColors', this.config_.customColors);
      this.queryGrid_.setColors(this.config_.paletteName,
          this.config_.customColors);
    });
  }

  /**
   * Updates the grid object based on offline status. This affects the colors
   *     used.
   *
   * @param {boolean} status True if online.
   */
  updateOnlineStatus(status) {
    if (this.queryGrid_) {
      this.queryGrid_.setOnlineStatus(status);
    }
  }

  /**
   * Registers listeners for change in network state.
   */
  addNetworkChangeListeners_() {
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
  }

  /**
   * Initialises the settings dialog.
   */
  initDialog_() {
    const dialog = document.querySelector('#dialog');

    this.dialogButton_.addEventListener('click', () => {
      if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
      }
      const rowsSliderPromise = this.waitForSlider_('rowsSlider');
      const colsSliderPromise = this.waitForSlider_('colsSlider');
      const typingSpeedPromise = this.waitForSlider_('typingSpeed');
      Promise.all([rowsSliderPromise, colsSliderPromise, typingSpeedPromise])
          .then((values) => {
            values[0].MaterialSlider.change(this.config_.numRows);
            values[1].MaterialSlider.change(this.config_.numCols);
            values[2].MaterialSlider.change(this.config_.typingSpeed);
            dialog.showModal();
          });
    });
    dialog.querySelector('button:not([disabled])')
        .addEventListener('click', () => {
          dialog.close();
        });
  }

  /**
   * Displays the Drive picker.
   */
  showPicker_() {
    if (this.authToken_ && this.auth2_.isSignedIn.get()) {
      const appId = CLIENT_ID.split(/-\./)[0];
      const picker = new google.picker.PickerBuilder().
          addView(google.picker.ViewId.SPREADSHEETS).
          setAppId(appId).
          setOAuthToken(this.authToken_).
          setDeveloperKey(API_KEY).
          setCallback(this.pickerCallback_.bind(this)).
          build();
      picker.setVisible(true);
    }
  }

  /**
   * Called by the Picker dialog on close, updates the selected document.
   *
   * @param {string} data
   */
  pickerCallback_(data) {
    if (data.action == google.picker.Action.PICKED) {
      this.config_.documentId = data.docs[0].id;
      localStorage.setItem('documentId', this.config_.documentId);
      this.fetchSheets_();
    }
  }

  /**
   * Initialise the Google Auth library and launch loading of the spreadsheet.
   */
  initAuth_() {
    gapi.client.setApiKey(API_KEY);
    gapi.auth2.init({
      /* eslint camelcase: 0*/
      client_id: CLIENT_ID,
      scope: SCOPES,
      fetch_basic_profile: false,
    }).then((r) => {
      this.auth2_ = gapi.auth2.getAuthInstance();
      this.auth2_.isSignedIn.listen((s) => this.updateSigninStatus_(s));
      this.updateSigninStatus_(this.auth2_.isSignedIn.get());
    });
  }

  /**
   * Creates a periodic check to determine if to refresh OAuth, then does so.
   */
  createRefreshOAuthTimer_() {
    setTimeout(() => {
      this.createRefreshOAuthTimer_();
      if (this.auth2_) {
        const user = this.auth2_.currentUser.get();
        if (user && user.isSignedIn()) {
          const token = gapi.auth.getToken();
          if (token.expires_at - new Date() < MIN_TOKEN_REMAINING_MS) {
            user.reloadAuthResponse().then((r) => {
              this.authToken_ = gapi.auth.getToken().access_token;
            });
          }
        }
      }
    }, OAUTH_CHECK_MS);
  }

  /**
   * Changes the button displayed depending on whether signed-in or out.
   *
   * @param {boolean} isSignedIn Whether the user is signed in or not.
   */
  updateSigninStatus_(isSignedIn) {
    if (isSignedIn) {
      this.authToken_ = gapi.auth.getToken().access_token;
      this.authorizeButton_.classList.add('hidden');
      this.signoutButton_.classList.remove('hidden');
      this.documentButton_.classList.remove('mdl-button--disabled');

      this.loadSheets_();
    } else {
      this.authToken_ = null;
      this.authorizeButton_.classList.remove('hidden');
      this.signoutButton_.classList.add('hidden');
      this.documentButton_.classList.add('mdl-button--disabled');
    }
  }

  /**
   * Attempts to fetch the spreadsheet data and then update the grid object with
   * the retrieved data. Also, sets up a retrieval in the future, and cancels
   * any existing future retrievals to ensure only one is queued up.
   */
  fetchSheets_() {
    if (!this.config_.documentId) {
      return;
    }
    if (navigator.onLine) {
      this.showSnackbar_('Loading spreadsheet data...');
      gapi.client.sheets.spreadsheets.get({
        spreadsheetId: this.config_.documentId,
        includeGridData: true,
      }).then((r) => this.updateSheetData_(r),
          (e) => this.handleFetchError_(e));
    } else {
      this.showSnackbar_('Oops! It appears we\'re offline...',
          SNACKBAR_ERR_TIMEOUT_MS);
    }

    if (this.currentTimerPromiseCancel_) {
      this.currentTimerPromiseCancel_.cancel();
    }

    this.currentTimerPromiseCancel_ = new TimerPromiseCancel();
    this.timerPromise_(this.currentTimerPromiseCancel_)
        .then(() => this.fetchSheets_());
  }

  /**
   * Creates a data provider from the Spreadsheet fetch response and pass it to
   * the grid object, so that it can be used as a source of queries.
   *
   * @param {!Object} response The response object from the Sheets API.
   */
  updateSheetData_(response) {
    this.queryProvider_ = QueryProvider.createFromSpreadsheet(response);
    this.queryGrid_.setQueryProvider(this.queryProvider_);
    this.queryGrid_.startAll();
  }

  /**
   * Shows an error snackbar for failed spreadsheet fetches.
   *
   * @param {!Object} err The error response from the Sheets API.
   */
  handleFetchError_(err) {
    this.showSnackbar_(err.result.error.message, SNACKBAR_ERR_TIMEOUT_MS);
  }

  /**
   * Displays the snackbar component.
   *
   * @param {string} message The text to display.
   * @param {number=} optTimeout Milliseconds to show for; optional override.
   */
  showSnackbar_(message, optTimeout) {
    const notification = document.querySelector('.mdl-js-snackbar');
    const data = {
      message: message,
      timeout: optTimeout || SNACKBAR_TIMEOUT_MS,
      actionHandler: function() { },
      actionText: 'OK',
    };
    notification.MaterialSnackbar.showSnackbar(data);
  }

  /**
   * Loads Sheets into the client library then starts the spreadsheet fetch.
   */
  loadSheets_() {
    if (this.config_.documentId) {
      gapi.client.load('sheets', 'v4').then(() => this.fetchSheets_());
    }
  }
}

export {GriddyApp};
