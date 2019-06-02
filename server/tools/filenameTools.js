module.exports = {
  encodeFilename(filename) {
    return filename
      .replace(/\+/g, '%2B')
      .replace(/ /g, '-')
      .replace(/\//g, '%2F')
      .replace(/\?/g, '%3F')
      .replace(/#/g, '%23')
      .replace(/&/g, '%26')
      .replace(/=/g, '%3D');
  },
  decodeFilename(filename) {
    return filename
      .replace(/%2B/g, '+')
      .replace(/%2F/g, '/')
      .replace(/%3F/g, '?')
      .replace(/%23/g, '#')
      .replace(/%26/g, '&')
      .replace(/%3D/g, '=');
  }
};