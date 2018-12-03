
const COLORS = [
  'ffe79a',
  'ffa952',
  'ef5a5a',
  '98ccd3',
  '364e68',
  '132238',
  'a6cb12',
  'e00543',
  '84253e',
  'f16f6f',
  '94d2e6',
  'fff78f',
  'ea9c1b',
  '5f685a',
  '362207',
  '843b62',
  'f67e7d',
  'ffb997',
];

const ITEM_CLASSNAMES = [
  'behavior',
  'location',
  'emotion',
  'sound',
];

const PROP_CLASSNAMES = [
  'do',
  'feel',
  'related_to',
  'location_of',
  'sound_of',
]

function getItemColor(item) {
  const idx = ITEM_CLASSNAMES.indexOf(item.class);
  if (idx >= 0) {
    return COLORS[idx];
  } else {
    return COLORS[ITEM_CLASSNAMES.length];
  }
}

function getPropColor(prop) {
  const idx = PROP_CLASSNAMES.indexOf(prop.classname);
  if (idx >= 0) {
    return COLORS[idx + ITEM_CLASSNAMES.length + 1];
  } else { 
    return COLORS[ITEM_CLASSNAMES.length + PROP_CLASSNAMES.length + 2];
  }
}

function convertGraph(rows) {
  const nodes = [];
  const links = [];
  for (const row of rows) {
    switch (row.type) {
      case 'item':
        nodes.push({
          ...row,
          id: `item-${row.id}`,
          color: getItemColor(row),
        });
        break;

      case 'property':
        nodes.push({
          id: `property-${row.id}`,
          color: getPropColor(row),
        });
        links.push({
          id: `plink-source-${row.id}`,
          source: `item-${row.source_item_id}`,
          target: `property-${row.id}`,
          value: 1,
        });
        links.push({
          id: `plink-target-${row.id}`,
          source: `property-${row.id}`,
          target: `item-${row.target_item_id}`,
          value: 1,
        });
        if (row.relation_item_id) {
          links.push({
            id: `plink-relation-${row.id}`,
            source: `property-${row.id}`,
            target: `item-${row.relation_item_id}`,
            value: 1,
            dotted: true,
          });
        }
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