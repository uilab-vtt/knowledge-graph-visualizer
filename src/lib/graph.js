
export async function loadGraph(url) {
  const response = await fetch(url);
  const data = await response.text();
  const nodes = data.split('\n')
    .filter(line => line.trim() !== '')
    .map(line => JSON.parse(line.trim()));
  return nodes;
}