import { createNode } from '../lib';

test('create one node', () => {

  const diluc = createNode({
    name: 'Diluc',
    age: '28',
  });

  expect(diluc.get('name')).toBe('Diluc');
});
