
export async function loadSentences(url) {
  const response = await fetch(url);
  const data = await response.text();
  const sentences = data.split('\n')
    .filter(line => line.trim() !== '')
    .map(line => JSON.parse(line.trim()));
  return sentences;
}