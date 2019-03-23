module.exports = {
  encodeFilename(filename) {
    return filename.replace('+', '%2B')
      .replace(' ', '-')
      .replace('/', '%2F')
      .replace('?', '%3F')
      .replace('#', '%23')
      .replace('&', '%26')
      .replace('=', '%3D');
  },
  decodeFilename(filename) {
    return filename.replace('%2B', '+')
      .replace('%2F', '/')
      .replace('%3F', '?')
      .replace('%23', '#')
      .replace('%26', '&')
      .replace('%3D', '=');
  }
};