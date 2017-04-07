export const needsPatching = (userAgent) => { // eslint-disable-line
  const result = /iPhone OS ([0-9_]+)/.exec(userAgent);
  if (result) {
    const version = result[1];
    const parts = (version || '').split('_');
    const major = parseInt(parts[0] || '10', 10);
    const minor = parseInt(parts[1] || '0', 10);
    // const fix = parseInt(parts[2] || '0', 10);
    if (major < 9) {
      return true;
    } else if (major === 9 && minor < 3) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
