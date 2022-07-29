# Glue Node [![npm](https://img.shields.io/npm/v/gluenode)](https://www.npmjs.com/package/gluenode)

A DOM-like data structure

## Get Started
```bash
npm install gluenode --save
```

## Example

Node relationship diagram

![Node relationship diagram](https://raw.githubusercontent.com/lemonied/gluenode/master/example/example.png)

```typescript
import { createNode } from 'gluenode';

const windy = createNode({
  name: 'Windy',
  age: 20,
});
windy.get('age'); // Output: 20
windy.get('name'); // Output: "Windy"

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

diluc.previousSibling; // Output: null
diluc.nextSibling; // Output: klee(GlueNode<{ name: string; age: number; }>)
klee.parentNode; // Output: windy(GlueNode<{ name: string; age: number; }>)

Array.from(barbara.children); // Output: [bennett, jean]
barbara.firstChild; // Output: bennett
barbara.lastChild; // Output: jean

```

## API

### Constructor
- `new (original: T): GlueNode<T>`

- `GlueNode.create(original: T): GlueNode<T>`

### Properties

- `origin` Get original object
- `parentNode` Get parent node
- `previousSibling` Get previous sibling
- `nextSibling` Get next sibling
- `firstChild` Get first child
- `lastChild` Get last child
- `firstSibling` Get first sibling
- `lastSibling` Get last sibling
- `rootNode` Get root node
- `sourceChain` Get chain
```typescript
Array.from(glueNode.sourceChain) // [this, father, grandfather, ..., root]
// or
glueNode.sourceChain.toArray()
```
- `children` Get children { [Symbol.iterator] }
```typescript
// transform glueNode.children to Array
Array.from(glueNode.children)
// or
glueNode.children.toArray()
```
- `siblings` Get all siblings
```typescript
Array.from(glueNode.siblings) // [firstSibling, ... , previousSibling, this, nextSibling, ..., lastSibling]
// or
glueNode.siblings.toArray()
```

### Methods
- `get<K extends keyof T>(key: K): T[K]`
- `set<K extends keyof T>(key: K, value: T[K]): this`
- `replaceChild(newNode: GlueNode<T>, oldNode: GlueNode<T>): this`
- `insertBefore(newNode: GlueNode<T>, oldNode: GlueNode<T>): this`
- `prependChild(newNode: GlueNode<T>): this`
- `appendChild(newNode: GlueNode<T>): this`
- `removeChild(node: GlueNode<T>): this`
- `remove(): this`
- `find(predicate: (node: GlueNode<T>) => boolean): GlueNode<T> | null`
- `findChild(predicate: (node: GlueNode<T>) => boolean): GlueNode<T> | null`
- `findSibling(predicate: (node: GlueNode<T>) => boolean): GlueNode<T> | null`
- `toJSON(): T & { children: T[] }`
