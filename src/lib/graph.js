import { decamelize } from 'humps';

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
  'unknown',
];

const PROP_CLASSNAMES = [
  'do',
  'feel',
  'related_to',
  'location_of',
  'sound_of',
];

const TIME_SLACK = 0.5;

const mergePropClassNodes = false;

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

function addNodeValidTime(node, timeStart, timeEnd) {
  const isPrevValid = node.isValid;
  node.isValid = null;
  // eslint-disable-next-line no-loop-func
  node.isValid = t => (isPrevValid(t) || (t >= timeStart && t <= timeEnd));
}

function addNodeBoxedTime(node, timeStart, timeEnd) {
  const isPrevBoxed = node.isBoxed;
  node.isBoxed = null;
  // eslint-disable-next-line no-loop-func
  node.isBoxed = t => (isPrevBoxed(t) || (t >= timeStart && t <= timeEnd));
}

function convertGraph(rows) {
  const nodes = [];
  const links = [];
  const boxes = [];
  const nodeMap = {};
  for (const row of rows) {
    switch (row.type) {
      case 'box': if (true) {
        const timeStart = row.time;
        const timeEnd = row.time + (TIME_SLACK * 2);
        const itemNode = nodeMap[`item-${row.item_id}`];
        const box = {
          id: `box-${row.id}`,
          timeStart,
          timeEnd,
          x: row.x_start,
          y: row.y_start,
          w: row.x_end - row.x_start,
          h: row.y_end - row.y_start,
        };
        boxes.push(box);
        if (itemNode) {
          addNodeBoxedTime(itemNode, timeStart, timeEnd);
        }
      }
      break;

      case 'item': if (true) {
        if (row.class === 'unknown') {
          if (!nodeMap['item-unknown']) {
            const unknownNode = {
              type: 'item',
              id: 'item-unknown',
              color: getItemColor(row),
              label: 'item:boxed',
              isAbstract: true,
              isValid: () => false,
              isBoxed: () => false,
            };
            nodes.push(unknownNode);
            nodeMap['item-unknown'] = unknownNode;
          }
          nodeMap[`item-${row.id}`] = nodeMap['item-unknown'];
          continue;
        }
        const node = {
          type: 'item',
          id: `item-${row.id}`,
          color: getItemColor(row),
          label: `${row.class}:${row.label}`,
          isAbstract: row.is_abstract,
          isValid: row.is_abstract ? () => false : () => true,
          isBoxed: () => false,
        };
        nodes.push(node);
        nodeMap[node.id] = node;
      } 
      break;

      case 'property': if (true) {
        const sourceNode = nodeMap[`item-${row.source_item_id}`];
        const targetNode = nodeMap[`item-${row.target_item_id}`];
        const timeStart = row.time_start - TIME_SLACK;
        const timeEnd = row.time_end + TIME_SLACK;
        if (sourceNode && sourceNode.isAbstract) {
          addNodeValidTime(sourceNode, timeStart, timeEnd);
        }
        if (targetNode && targetNode.isAbstract) {
          addNodeValidTime(targetNode, timeStart, timeEnd);
        }
        let propNode = null;
        if (mergePropClassNodes) {
          const propClassNodeId = `property-class-${row.classname}`;
          if (!nodeMap[propClassNodeId]) {
            const propClassNode = {
              type: 'property',
              id: propClassNodeId,
              color: getPropColor(row),
              label: `${decamelize(row.classname)}`,
              isValid: t => false,
              isBoxed: () => false,
            }
            nodeMap[propClassNodeId] = propClassNode;
            nodes.push(propClassNode);
          }
          propNode = nodeMap[propClassNodeId];
          addNodeValidTime(propNode, timeStart, timeEnd);
        } else {
          propNode = {
            type: 'property',
            id: `property-${row.id}`,
            color: getPropColor(row),
            label: `${decamelize(row.classname)}`,
            isValid: t => (t >= timeStart && t <= timeEnd),
            isBoxed: () => false,
          };
          nodes.push(propNode);
        }
        if (sourceNode) {
          links.push({
            type: 'property',
            id: `plink-source-${row.id}`,
            source: sourceNode.id,
            target: propNode.id,
            shape: 'arrow',
            isValid: t => (t >= timeStart && t <= timeEnd),
          });
        }
        if (targetNode) {
          links.push({
            type: 'property',
            id: `plink-target-${row.id}`,
            source: propNode.id,
            target: targetNode.id,
            shape: 'arrow',
            isValid: t => (t >= timeStart && t <= timeEnd),
          });
        }
        if (row.relation_item_id) {
          const relationNode = nodeMap[`item-${row.relation_item_id}`];
          if (relationNode) {
            links.push({
              type: 'property',
              id: `plink-relation-${row.id}`,
              source: propNode.id,
              target: relationNode.id,
              shape: 'dotted',
              isValid: t => (t >= timeStart && t <= timeEnd),
            });
          }
        }
      }
      break;

      case 'valid_time': if (true) {
        const nodeId = `item-${row.item_id}`;
        const node = nodeMap[nodeId];
        if (node) {
          const isPrevValid = node.isValid;
          node.isValid = null;
          // eslint-disable-next-line no-loop-func
          node.isValid = t => (isPrevValid(t) || (t >= row.time_start && t <= row.time_end));
        }
      }
      break; 

      default:
      break;
    }
  }
  return { nodes, links, boxes };
}

export async function loadGraph(url) {
  const response = await fetch(url);
  const data = await response.text();
  const rows = data.split('\n')
    .filter(line => line.trim() !== '')
    .map(line => JSON.parse(line.trim()));
  return convertGraph(rows);
}