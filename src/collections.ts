import type GlueNode from './node';

interface CollectionIterator<T> {
  (): Generator<GlueNode<T>, void>;
}
export class NodeCollections<T> {
  [Symbol.iterator]!: CollectionIterator<T>;
  constructor(iterator: CollectionIterator<T>) {
    this[Symbol.iterator] = iterator;
  }
  public toArray() {
    return Array.from(this);
  }
  public toJSON() {
    return this.toArray().map(v => v.toJSON());
  }
}
