import { FC, useEffect, useRef } from 'react';
import { init, EChartsType } from 'echarts';
import { henan } from '../../helpers/city';

interface Point {
  x: number;
  y: number;
}

const edges: any[] = [];
function makeRelation(oneNode: typeof henan) {
  if (oneNode.parentNode) {
    edges.push({
      source: oneNode.get('value'),
      target: oneNode.parentNode.get('value'),
      label: {
        show: true,
        formatter: 'parentNode',
      },
    });
  }
  if (oneNode.firstChild) {
    edges.push({
      source: oneNode.get('value'),
      target: oneNode.firstChild.get('value'),
      label: {
        show: true,
        formatter: 'firstChild',
      },
    });
    makeRelation(oneNode.firstChild);
  }
  if (oneNode.lastChild) {
    edges.push({
      source: oneNode.get('value'),
      target: oneNode.lastChild.get('value'),
      label: {
        show: true,
        formatter: 'lastChild',
      },
    });
  }
  if (oneNode.previousSibling) {
    edges.push({
      source: oneNode.get('value'),
      target: oneNode.previousSibling.get('value'),
      label: {
        show: true,
        formatter: 'previousSibling',
      },
    });
  }
  if (oneNode.nextSibling) {
    edges.push({
      source: oneNode.get('value'),
      target: oneNode.nextSibling.get('value'),
      label: {
        show: true,
        formatter: 'nextSibling',
      },
    });
    makeRelation(oneNode.nextSibling);
  }
}
makeRelation(henan);

function makeData(oneNode: typeof henan, point: Point, size: number, color = 'red') {
  return {
    id: oneNode.get('value'),
    ...point,
    name: oneNode.get('label'),
    symbolSize: size,
    itemStyle: {
      color,
    },
  };
}

const country = makeData(henan, { x: 0, y: 0 }, 15);

const data = [country];

const colors = ['#52c41a', '#36cfc9', '#531dab', '#eb2f96', '#ad8b00', '#5b8c00'];
/** others */
function listChildren(oneNode: typeof henan, point: Point, colorIndex = 0, size = 10) {
  const list = Array.from(oneNode.children);
  list.forEach((v, k) => {
    data.push(makeData(v, point, size, colors[colorIndex % (colors.length - 1)]));
    point.x += 100;
    listChildren(v, { x: 0, y: point.y + (k + 1) * 100 }, colorIndex + 1, size - 2);
  });
}

listChildren(henan, { x: 0, y: 100 });

const Relation: FC = () => {

  const ref = useRef<HTMLDivElement>(null);
  const echartsRef = useRef<EChartsType>();

  useEffect(() => {
    echartsRef.current = init(ref.current!);
    return () => echartsRef.current?.dispose();
  }, []);

  useEffect(() => {

    echartsRef.current?.setOption({
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [{
        type: 'graph',
        edgeSymbol: ['none', 'arrow'],
        layout: 'none',
        data,
        edges,
        label: {
          position: 'inside',
          show: true
        },
        emphasis: {
          focus: 'adjacency',
        },
        roam: true,
        lineStyle: {
          width: 0.5,
          curveness: 0.3,
          opacity: 0.7
        },
      }],
    }, true);
  }, []);

  useEffect(() => {
    const resize = () => {
      echartsRef.current?.resize();
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }} ref={ref} />
  );
};

export { Relation };
