import { NodeCollections } from './collections';

function parentInspect<T>(glueNode: GlueNode<T>, parentLike: GlueNode<T>) {
  if (glueNode === parentLike) {
    throw new Error('Can\'t insert to itself');
  }
  let parent: GlueNode<T> | null = glueNode.parentNode;
  while (parent !== null) {
    if (parent === parentLike) {
      throw new Error('Parent node cannot be inserted into child node');
    }
    parent = parent.parentNode;
  }
  return true;
}

class GlueNode<T> {
  readonly #original: T;
  #parentNode: GlueNode<T> | null = null;
  #previousSibling: GlueNode<T> | null = null;
  #nextSibling: GlueNode<T> | null = null;
  #firstChild: GlueNode<T> | null = null;
  #lastChild: GlueNode<T> | null = null;
  public get origin() {
    return this.#original;
  }
  public get parentNode() {
    return this.#parentNode;
  }
  public get previousSibling() {
    return this.#previousSibling;
  }
  public get nextSibling() {
    return this.#nextSibling;
  }
  public get firstChild() {
    return this.#firstChild;
  }
  public get lastChild() {
    return this.#lastChild;
  }
  public get firstSibling() {
    let current: GlueNode<T> = this;
    while (current.previousSibling !== null) {
      current = current.previousSibling;
    }
    return current;
  }
  public get lastSibling() {
    let current: GlueNode<T> = this;
    while (current.nextSibling !== null) {
      current = current.nextSibling;
    }
    return current;
  }
  public get rootNode() {
    let current: GlueNode<T> = this;
    while (current.parentNode !== null) {
      current = current.parentNode;
    }
    return current;
  }
  public get sourceChain() {
    const _this = this;
    return new NodeCollections<T>(function*() {
      let next: GlueNode<T> | null = _this;
      while (next) {
        yield next;
        next = next.parentNode;
      }
    });
  }
  public get children() {
    const _this = this;
    return new NodeCollections<T>(function*() {
      let next = _this.firstChild;
      while (next) {
        yield next;
        next = next.nextSibling;
      }
    });
  }
  public get siblings() {
    const _this = this;
    return this.parentNode?.children || new NodeCollections<T>(function*() {
      yield _this;
    });
  }
  public static create<T>(original: T) {
    return new GlueNode(original);
  }
  constructor(original: T) {
    this.#original = { ...original };
  }
  public get<K extends keyof T>(key: K): T[K] {
    return this.#original[key];
  }
  public set<K extends keyof T>(key: K, value: T[K]) {
    this.#original[key] = value;
    return this;
  }
  public keys(): Array<keyof T> {
    return Object.keys(this.#original) as Array<keyof T>;
  }
  public replaceChild(newNode: GlueNode<T>, oldNode: GlueNode<T>) {
    this.insertBefore(newNode, oldNode);
    oldNode.remove();
    return this;
  }
  public insertBefore(newNode: GlueNode<T>, oldNode: GlueNode<T>) {
    if (parentInspect(this, newNode)) {
      newNode.remove();
      if (oldNode.parentNode !== this) {
        throw new Error('old node must be child node');
      }
      if (oldNode.previousSibling) {
        oldNode.previousSibling.#nextSibling = newNode;
        newNode.#previousSibling = oldNode.previousSibling;
      }
      oldNode.#previousSibling = newNode;
      newNode.#nextSibling = oldNode;
      newNode.#parentNode = this;
    }
    return this;
  }
  public prependChild(glueNode: GlueNode<T>) {
    if (parentInspect(this, glueNode)) {
      glueNode.remove();
      if (this.firstChild && this.lastChild) {
        this.firstChild.#previousSibling = glueNode;
        glueNode.#nextSibling = this.firstChild;
      } else {
        this.#lastChild = glueNode;
      }
      glueNode.#parentNode = this;
      this.#firstChild = glueNode;
    }
    return this;
  }
  public appendChild(glueNode: GlueNode<T>) {
    if (parentInspect(this, glueNode)) {
      glueNode.remove();
      if (this.firstChild && this.lastChild) {
        this.lastChild.#nextSibling = glueNode;
        glueNode.#previousSibling = this.lastChild;
      } else {
        this.#firstChild = glueNode;
      }
      glueNode.#parentNode = this;
      this.#lastChild = glueNode;
    }
    return this;
  }
  public removeChild(glueNode: GlueNode<T>) {
    const previous = glueNode.previousSibling;
    const next = glueNode.nextSibling;
    if (previous) {
      previous.#nextSibling = glueNode.nextSibling;
    }
    if (next) {
      next.#previousSibling = glueNode.previousSibling;
    }
    if (this.firstChild === glueNode) {
      this.#firstChild = glueNode.nextSibling;
    }
    if (this.lastChild === glueNode) {
      this.#lastChild = glueNode.previousSibling;
    }
    glueNode.#parentNode = null;
    glueNode.#previousSibling = null;
    glueNode.#nextSibling = null;
    return this;
  }
  public remove() {
    this.parentNode?.removeChild(this);
    return this;
  }
  public find(predicate: (node: GlueNode<T>) => boolean): GlueNode<T> | null {
    let current: GlueNode<T> | null = this.firstChild;
    while (current !== null) {
      if (predicate(current)) {
        return current;
      } else {
        const target = current.find(predicate);
        if (target) return target;
      }
      current = current.nextSibling;
    }
    return null;
  }
  public findChild(predicate: (node: GlueNode<T>) => boolean): GlueNode<T> | null {
    let current: GlueNode<T> | null = this.firstChild;
    while (current !== null) {
      if (predicate(current)) {
        return current;
      }
      current = current.nextSibling;
    }
    return null;
  }
  public findSibling(predicate: (node: GlueNode<T>) => boolean): GlueNode<T> | null {
    let previous: GlueNode<T> | null = this;
    let next: GlueNode<T> | null = this.nextSibling;
    while (previous !== null || next !== null) {
      if (previous) {
        if (predicate(previous)) return previous;
        previous = previous.previousSibling;
      }
      if (next) {
        if (predicate(next)) return next;
        next = next.nextSibling;
      }
    }
    return null;
  }
  public toJSON(): T & { children: T[] } {
    return {
      ...this.#original,
      children: Array.from(this.children).map(v => v.toJSON()),
    };
  }
}

export default GlueNode;
