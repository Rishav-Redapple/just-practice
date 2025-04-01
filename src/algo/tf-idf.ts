export function TFIDF(documents: string[]) {
  const tfidf: Record<string, number>[] = [];
  const idf = calculateIDF(documents);

  documents.forEach((document) => {
    const tf = calculateTF(document);
    const tfIdfDoc: Record<string, number> = {};

    /**
     * to get the tf-idf of a document, we simply print the dot product
     * of each tf and idf
     */
    for (const word in tf) {
      tfIdfDoc[word] = tf[word] * (idf[word] || 0);
      tfidf.push(tfIdfDoc);
    }
  });

  return tfidf;
}

function calculateTF(str: string) {
  /**
   * the term frequency matrix that holds the
   * word as key and its frequency as value
   */
  const tf: Record<string, number> = {};
  // normalize the characters
  const words = _normalize(str);

  /**
   * we set the recurring frequency of each words
   */
  for (const word of words) {
    tf[word] = (tf[word] || 0) + 1;
  }

  /**
   * we find the probability distribution for each words
   * found in the term frequency matrix and return it
   */
  for (const word in tf) {
    tf[word] /= words.length;
  }

  return tf;
}

function calculateIDF(arr: string[]) {
  /**
   * we declare the document frequency inversely
   */
  const idf: Record<string, number> = {};
  const documentCounts: Record<string, number> = {};
  const size = arr.length;

  /**
   * we create a unique array so each term only occurs once
   * and set its frequency to it
   */
  for (const document of arr) {
    const uniqueWords = new Set(_normalize(document));
    uniqueWords.forEach((word) => {
      documentCounts[word] = (documentCounts[word] || 0) + 1;
    });
  }

  /**
   * now we calculate the inverse term frequency of each
   * words and then return it
   */
  for (const word in documentCounts) {
    const frequency = documentCounts[word];
    idf[word] = Math.log(size / frequency);
  }

  return idf;
}

function _normalize(s: string) {
  return s.split(" ").map((s) => s.toLowerCase());
}
