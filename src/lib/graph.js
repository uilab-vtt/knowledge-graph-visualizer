
function convertGraph(rows) {
  const nodes = [];
  const links = [];
  for (const row of rows) {
    switch (row.type) {
      case 'item':
        nodes.push({
          ...row,
          id: `item-${row.id}`,
        });
        break;

      case 'property':
        links.push({
          ...row,
          id: `property-${row.id}`,
          source: `item-${row.source_item_id}`,
          target: `item-${row.target_item_id}`,
        });
        break;
    
      default:
        break;
    }
  }
  return { nodes, links };
}

export async function loadGraph(url) {
  const response = await fetch(url);
  const data = await response.text();
  const rows = data.split('\n')
    .filter(line => line.trim() !== '')
    .map(line => JSON.parse(line.trim()));
  return convertGraph(rows);
}