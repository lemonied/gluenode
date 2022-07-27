
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
  public static create<T>(original: T) {
    return new GlueNode(original);
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
  public toJSON(): T & { children: T[] } {
    return {
      ...this.#original,
      children: Array.from(this.children).map(v => v.toJSON()),
    };
  }
}

export default GlueNode;
