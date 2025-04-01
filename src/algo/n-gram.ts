export function NGramPrediction(str: string) {
  // characters in pair
  const bingrams: Record<string, number> = {};

  /**
   * we set the key as current char + the next char = exactly 2 chars
   * with the value, number of frequency.
   */
  for (let i = 0; i < str.length - 1; i++) {
    const pair = str[i] + str[i + 1];
    bingrams[pair] = (bingrams[pair] || 0) + 1;
  }

  const lastCharInStr = str[str.length - 1];
  const possibleNextChars: string[] = [];

  /**
   * we check if the first char of the pair is the last char in string
   * if so, we put the last char of the pair to the possibleChars.
   */
  for (const pair in bingrams) {
    if (pair[0] == lastCharInStr) {
      possibleNextChars.push(pair[1]);
    }
  }

  let nextChar = "";
  let maxFreq = 0;

  /**
   * we check if the last char in the string + the next possible char
   * could be found in bigrams, then we get its frequency count.
   * And finally we declare the 'nextChar' that has the highest
   * frequency in the bigrams chart.
   */
  for (const char of possibleNextChars) {
    const freq = bingrams[lastCharInStr + char];
    if (freq > maxFreq) {
      maxFreq = freq;
      nextChar = char;
    }
  }

  return nextChar;
}
