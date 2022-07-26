import { createNode } from '../../../../';
import henanJson from './410000.topo.json';
import json2 from './410100.topo.json';
import json3 from './410200.topo.json';
import json4 from './410300.topo.json';
import json5 from './410400.topo.json';
import json6 from './410500.topo.json';
import json7 from './410600.topo.json';
import json8 from './410700.topo.json';
import json9 from './410800.topo.json';
import json10 from './410900.topo.json';
import json11 from './411000.topo.json';
import json12 from './411100.topo.json';
import json13 from './411200.topo.json';
import json14 from './411300.topo.json';
import json15 from './411400.topo.json';
import json16 from './411500.topo.json';
import json17 from './411600.topo.json';
import json18 from './411700.topo.json';

const cities = [
  json2,
  json3,
  json4,
  json5,
  json6,
  json7,
  json8,
  json9,
  json10,
  json11,
  json12,
  json13,
  json14,
  json15,
  json16,
  json17,
  json18,
];

const henan = createNode({
  label: henanJson.propertity.fullname,
  value: `${henanJson.propertity.code}`,
  point: [henanJson.propertity.center[0] + 4, henanJson.propertity.center[1]],
});

cities.forEach(v => {
  const city = createNode({
    label: v.propertity.fullname,
    value: `${v.propertity.code}`,
    point: v.propertity.center,
  });
  v.objects.default.geometries.forEach(county => {
    const c = createNode({
      label: county.properties.fullname,
      value: `${county.properties.code}`,
      point: county.properties.center,
    });
    city.appendChild(c);
  });
  henan.appendChild(city);
});

console.log(henan.toJSON());

export { henan };
