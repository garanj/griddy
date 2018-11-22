/**
 * Predefined palettes, with credit to color-hex.com
 */
const PALETTES = {
  'Facebook': ['#3b5998', '#8b9dc3', '#dfe3ee', '#f7f7f7', '#fff'],
  'Bootstrap': ['#d9534f', '#f9f9f9', '#5bc0de', '#5cb85c', '#428bca'],
  'Gold': ['#a67c00', '#bf9b30', '#ffbf00', '#ffcf40', '#ffdc73'],
  'Google ': ['#4285F4', '#0F9D58', '#F4B400', '#DB4437'],
  'Skin Tones': ['#8d5524', '#c68642', '#e0ac69', '#f1c27d', '#ffdbac'],
  'Pastel rainbow': ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'],
  'Pastel': ['#e1f7d5', '#ffbdbd', '#c9c9ff', '#fff', '#f1cbff'],
  'Discord': ['#7289da', '#fff', '#99aab5', '#2c2f33', '#23272a'],
  'Shades of Gray': ['#999', '#777', '#555', '#333', '#111'],
  'Beach': ['#96ceb4', '#ffeead', '#ff6f69', '#ffcc5c', '#88d8b0'],
  'RGB Grey White': ['#ff0000', '#00ff00', '#0000ff', '#eeeeee', '#000000'],
  'Beautiful Blues': ['#011f4b', '#03396c', '#005b96', '#6497b1', '#b3cde0'],
  'Cappuccino': ['#4b3832', '#854442', '#fff4e6', '#3c2f2f', '#be9b7b'],
  'Space-gray': ['#343d46', '#4f5b66', '#65737e', '#a7adba', '#c0c5ce'],
  'Gryffindor': ['#740001', '#ae0001', '#eeba30', '#d3a625', '#000000'],
  'Metro UI': ['#d11141', '#00b159', '#00aedb', '#f37735', '#ffc425'],
  'Shades of Turquoise': [
    '#b3ecec', '#89ecda', '#43e8d8', '#40e0d0', '#3bd6c6',
  ],
  'Blue-Grey': ['#6e7f80', '#536872', '#708090', '#536878', '#36454f'],
  'Shades of Purple': ['#efbbff', '#d896ff', '#be29ec', '#800080', '#606'],
  'Retro': ['#666547', '#fb2e01', '#6fcb9f', '#ffe28a', '#fffeb3'],
  'Seafoam': ['#a3c1ad', '#a0d6b4', '#5f9ea0', '#317873', '#49796b'],
  'Down Town': ['#373854', '#493267', '#9e379f', '#e86af0', '#7bb3ff'],
  'Pastel': ['#1b85b8', '#5a5255', '#559e83', '#ae5a41', '#c3cb71'],
  'White': ['#fdfbfb', '#fbfdfb', '#fdfdff', '#fdf9f9', '#fdfbfb'],
  'Skin and Lips': ['#eec1ad', '#dbac98', '#d29985', '#c98276', '#e35d6a'],
  'YouTube': ['#cc181e', '#2793e8', '#590', '#666', '#f1f1f1'],
  'Ravenclaw': ['#0e1a40', '#222f5b', '#5d5d5d', '#946b2d', '#000'],
  'PwC Corp': ['#dc6900', '#eb8c00', '#e0301e', '#a32020', '#602320'],
  'Slytherin': ['#1a472a', '#2a623d', '#5d5d5d', '#aaa', '#000000'],
  'Dark Red to Light Red': ['#f00', '#bf0000', '#800000', '#400000', '#000'],
  'Shades of Teal': ['#b2d8d8', '#66b2b2', '#008080', '#066', '#004c4c'],
  'Teal': ['#077', '#066', '#055', '#044', '#033'],
  'Rainbow Dash': ['#ee4035', '#f37736', '#fdf498', '#7bc043', '#0392cf'],
  'Android Lollipop': ['#009688', '#35a79c', '#54b2a9', '#65c3ba', '#83d0c9'],
  'Pastel rainbow': ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94'],
  'Shades of Green': ['#adff00', '#74d600', '#028900', '#00d27f', '#00ff83'],
  'Blood Red': ['#830303', '#00ff00', '#0000ff', '#eeeeee', '#000000'],
  'Anime': ['#ffe9dc', '#fce9db', '#e0a899', '#dfa290', '#c99789'],
  'Metro Style': ['#00aedb', '#a200ff', '#f47835', '#d41243', '#8ec127'],
  'Rose Gold': ['#e3e4e6', '#f7d0cb', '#f9fafc', '#313131', '#f6d9d5'],
  'Shades of Pink': ['#ff00a9', '#fb9f9f', '#ff0065', '#ffbfd3', '#fb5858'],
  'Soft Black': ['#414a4c', '#3b444b', '#353839', '#232b2b', '#0e1111'],
  'Italy Flag': ['#f2f2f2', '#009246', '#fff', '#ce2b37', '#f2f2f2'],
  'Princess Pink': ['#ffc2cd', '#ff93ac', '#ff6289', '#fc3468', '#ff084a'],
  'VaporWave': ['#ff71ce', '#01cdfe', '#05ffa1', '#b967ff', '#fffb96'],
  'Twitter': ['#326ada', '#d4d8d4', '#433e90', '#a19c9c', '#d2d2d2'],
  'Faded Rose': ['#dfdfde', '#a2798f', '#d7c6cf', '#8caba8', '#ebdada'],
  'Neon 0908': ['#fe0000', '#fdfe02', '#0bff01', '#011efe', '#fe00f6'],
  'Hufflepuff': ['#ecb939', '#f0c75e', '#726255', '#372e29', '#000000'],
  'Dark Skin Tones': ['#9c7248', '#926a2d', '#876127', '#7c501a', '#6f4f1d'],
  'Off white': ['#fffff2', '#f9f9f9', '#fffff4', '#fbf7f5', '#f9f1f1'],
  'Craftsman': ['#d7c797', '#845422', '#ead61c', '#a47c48', '#000000'],
  'Twilight Sparkle': ['#363b74', '#673888', '#ef4f91', '#c79dd7', '#4d1b7b'],
  'Nude': ['#9a8262', '#e8ca93', '#f0e2a8', '#fff', '#fff68f'],
  'Summer Coming': ['#ff4e50', '#fc913a', '#f9d62e', '#eae374', '#e2f4c7'],
  'Pastels': ['#ffd4e5', '#d4ffea', '#eecbff', '#feffa3', '#dbdcff'],
  'Indian Flag': ['#ff8000', '#fff', '#00f', '#fff', '#008000'],
  'Ice cream': ['#6b3e26', '#ffc5d9', '#c2f2d0', '#fdf5c9', '#ffcb85'],
  'Cool': ['#0073e5', '#7ddc1f', '#f5f5f5', '#444', '#000000'],
  'Aesthetic': ['#66545e', '#a39193', '#aa6f73', '#eea990', '#f6e0b5'],
  'Christmas': ['#ff0000', '#ff7878', '#fff', '#74d680', '#378b29'],
  'Muted': ['#2e4045', '#83adb5', '#c7bbc9', '#5e3c58', '#bfb5b2'],
  'Shades of White': ['#faf0e6', '#fff5ee', '#fdf5e6', '#faf0e6', '#faebd7'],
  '#3': ['#2a4d69', '#4b86b4', '#adcbe3', '#e7eff6', '#63ace5'],
  'Blues': ['#7af', '#9cf', '#bef', '#58f', '#36f'],
  'Facebook Messenger': ['#0084ff', '#44bec7', '#ffc300', '#fa3c4c', '#d696bb'],
  'Green logo': ['#52bf90', '#49ab81', '#419873', '#398564', '#317256'],
  'Fire': ['#fdcf58', '#757676', '#f27d0c', '#800909', '#f07f13'],
  'Wood Floor': ['#8b5a2b', '#ffa54f', '#a0522d', '#cd8500', '#8b4513'],
  'Ultimate Red': ['#ff0000', '#f00', '#f00', '#f00', '#f00'],
  'Peacocks & Butterflies': [
    '#c6c386', '#7df9ff', '#0095b6', '#0892d0', '#000000',
  ],
  'Loznice': ['#a69eb0', '#efeff2', '#f2e2cd', '#dadae3', '#000000'],
  'Red': ['#b62020', '#cb2424', '#fe2e2e', '#fe5757', '#fe8181'],
  'Iron Man': ['#771414', '#beba46', '#8bd3fb', '#bcb841', '#790d0d'],
  'Purple-Grey': ['#8b8589', '#989898', '#838996', '#979aaa', '#4c516d'],
  'Grey-Lavender': ['#d2d4dc', '#afafaf', '#f8f8fa', '#e5e6eb', '#c0c2ce'],
  'Parrot Green': ['#234d20', '#36802d', '#77ab59', '#c9df8a', '#f0f7da'],
  'Material Design #3': ['#ff5722', '#9e9e9e', '#607d8b', '#000', '#fff'],
  'Hudcolor': ['#f6c', '#cf6', '#6cf', '#fff', '#000000'],
  'The Best of Metro': ['#00aba9', '#ff0097', '#a200ff', '#1ba1e2', '#f09609'],
  'Pastel Palette': ['#b8dbd3', '#f7e7b4', '#68c4af', '#96ead7', '#f2f6c3'],
  'Mickey Mouse': ['#f9d70b', '#000', '#f20505', '#fff', '#f0e046'],
  'Sage Green': ['#8f9779', '#78866b', '#738276', '#738678', '#4d5d53'],
  'Instagram': ['#966842', '#f44747', '#eedc31', '#7fdb6a', '#0e68ce'],
  'Program Catalog': ['#edc951', '#eb6841', '#cc2a36', '#4f372d', '#00a0b0'],
  'MoreTriadics': ['#f7a', '#af7', '#7af', '#fff', '#000000'],
  'Light Retro': ['#e5c3c6', '#e1e9b7', '#f96161', '#bcd2d0', '#d0b783'],
  'T-Mobile': ['#ff009f', '#f063c1', '#f7c1ea', '#ffd2fa', '#f2def0'],
  'Army Camouflage': ['#604439', '#9e9a75', '#1c222e', '#41533b', '#554840'],
  'Arjuna': ['#5ff', '#0ff', '#0000ff', '#38eeff', '#5fe'],
  'Summertime 3': ['#ffbe4f', '#6bd2db', '#0ea7b5', '#0c457d', '#e8702a'],
  'Cool blue': ['#005073', '#107dac', '#189ad3', '#1ebbd7', '#71c7ec'],
  'Green logo 2': ['#295f48', '#204c39', '#18392b', '#eeeeee', '#000000'],
  'Violet': ['#fff', '#e5d0ff', '#dabcff', '#cca3ff', '#bf8bff'],
};

const CUSTOM_NAME = '<Custom>';

let names;

/**
 * A class to provide predefined color palettes.
 */
class Palettes {
  /**
   * Retrieves a list of hex values for a given palette.
   *
   * @param {string} paletteName
   * @return {Array.<string>} list of hex value strings.
   */
  static getHexCodesList(paletteName) {
    return PALETTES[paletteName];
  }

  /**
   * Retrieves a list predefined palette names.
   *
   * @return {!Array.<string>} A list of names.
   */
  static getPaletteNames() {
    if (!names) {
      names = [...Object.keys(PALETTES), CUSTOM_NAME];
      names.sort();
    }
    return names;
  }
}

export {Palettes};
