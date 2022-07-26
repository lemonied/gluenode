
function parentInspect<T>(oneNode: OneNode<T>, parentLike: OneNode<T>) {
  if (oneNode === parentLike) {
    throw new Error('Can\'t insert to itself');
  }
  let parent: OneNode<T> | null = oneNode.parentNode;
  while (parent !== null) {
    if (parent === parentLike) {
      throw new Error('Parent node cannot be inserted into child node');
    }
    parent = parent.parentNode;
  }
  return true;
}

export class OneNode<T> {
  readonly #original: T;
  #parentNode: OneNode<T> | null = null;
  #previousSibling: OneNode<T> | null = null;
  #nextSibling: OneNode<T> | null = null;
  #firstChild: OneNode<T> | null = null;
  #lastChild: OneNode<T> | null = null;
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
  public get children() {
    const _this = this;
    return {
      *[Symbol.iterator]() {
        let next = _this.firstChild;
        while (next) {
          yield next;
          next = next.nextSibling;
        }
      }
    };
  }
  constructor(original: T) {
    this.#original = { ...original };
  }
  public get<K extends keyof T>(key: K): T[K] {
    return this.#original[key];
  }
  public keys(): Array<keyof T> {
    return Object.keys(this.#original) as Array<keyof T>;
  }
  public insertBefore(newNode: OneNode<T>, oldNode: OneNode<T>) {
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
  public prependChild(oneNode: OneNode<T>) {
    if (parentInspect(this, oneNode)) {
      oneNode.remove();
      if (this.firstChild && this.lastChild) {
        this.firstChild.#previousSibling = oneNode;
        oneNode.#nextSibling = this.firstChild;
      } else {
        this.#lastChild = oneNode;
      }
      oneNode.#parentNode = this;
      this.#firstChild = oneNode;
    }
    return this;
  }
  public appendChild(oneNode: OneNode<T>) {
    if (parentInspect(this, oneNode)) {
      oneNode.remove();
      if (this.firstChild && this.lastChild) {
        this.lastChild.#nextSibling = oneNode;
        oneNode.#previousSibling = this.lastChild;
      } else {
        this.#firstChild = oneNode;
      }
      oneNode.#parentNode = this;
      this.#lastChild = oneNode;
    }
    return this;
  }
  public removeChild(oneNode: OneNode<T>) {
    const previous = oneNode.previousSibling;
    const next = oneNode.nextSibling;
    if (previous) {
      previous.#nextSibling = oneNode.nextSibling;
    }
    if (next) {
      next.#previousSibling = oneNode.previousSibling;
    }
    if (this.firstChild === oneNode) {
      this.#firstChild = oneNode.nextSibling;
    }
    if (this.lastChild === oneNode) {
      this.#lastChild = oneNode.previousSibling;
    }
    oneNode.#parentNode = null;
    oneNode.#previousSibling = null;
    oneNode.#nextSibling = null;
    return this;
  }
  public remove() {
    this.parentNode?.removeChild(this);
    return this;
  }
  public toJSON(): T & { children: T[] } {
    return {
      ...this.#original,
      children: Array.from(this.children).map(v => v.toJSON()),
    };
  }
}

export function createNode<T>(original: T) {
  return new OneNode(original);
}
