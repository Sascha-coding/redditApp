export function generateSecureRandomString(length) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return array.toString(36).slice(-length);
  }
