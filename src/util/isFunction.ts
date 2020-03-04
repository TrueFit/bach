export default (obj: unknown): boolean =>
  Object.prototype.toString.call(obj) === '[object Function]';
