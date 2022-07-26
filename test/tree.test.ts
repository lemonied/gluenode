import { createNode } from '../lib';

test('create node tree', () => {

  const windy = createNode({
    name: 'Windy',
    age: 20,
  });

  const diluc = createNode({
    name: 'Diluc',
    age: 28,
  });

  const klee = createNode({
    name: 'Klee',
    age: 8,
  });

  const barbara = createNode({
    name: 'Barbara',
    age: 12,
  });

  const bennett = createNode({
    name: 'Bennett',
    age: 13,
  });

  const jean = createNode({
    name: 'Jean',
    age: 23,
  });

  windy.appendChild(diluc)
    .appendChild(klee)
    .appendChild(barbara);

  barbara.appendChild(bennett)
    .appendChild(jean);

  expect(windy.parentNode).toBeNull();
  expect(windy.firstChild).toBe(diluc);
  expect(windy.lastChild).toBe(barbara);

  expect(klee.previousSibling).toBe(diluc);
  expect(klee.nextSibling).toBe(barbara);

  expect(diluc.previousSibling).toBeNull();

  expect(() => {
    barbara.appendChild(windy);
  }).toThrow('Parent node cannot be inserted into child node');

  expect(() => {
    barbara.appendChild(barbara);
  }).toThrow('Can\'t insert to itself');

  expect(jean.parentNode).toBe(barbara);
  expect(jean.previousSibling).toBe(bennett);
  expect(jean.nextSibling).toBeNull();

  windy.insertBefore(jean, klee);
  expect(jean.previousSibling).toBe(diluc);
  expect(jean.nextSibling).toBe(klee);
  expect(jean.parentNode).toBe(windy);
});
