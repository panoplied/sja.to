function rndChars(len: number) {

  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // const charSetLen = charSet.length;
  const charSetLen = 62;  // Probably won't change that often, so using magic number

  let resultString = '';

  for (let i = 0; i < len; i++) {
    resultString += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }

  return resultString;
}

export default rndChars;