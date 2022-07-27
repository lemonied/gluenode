import GlueNode from './node';

export function createNode<T>(original: T) {
  return new GlueNode(original);
}
