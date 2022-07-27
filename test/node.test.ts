import { createNode } from '../lib';

test('create one node', () => {

  const diluc = createNode({
    name: 'Diluc',
    age: 28,
  });

  expect(diluc.get('name')).toBe('Diluc');
});

test('set property of a node', () => {

  const diluc = createNode({
    name: 'Diluc',
    age: 28,
  });

  diluc.set('age', 29);
  expect(diluc.get('age')).toBe(29);
});
