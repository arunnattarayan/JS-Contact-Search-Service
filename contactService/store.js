// The file is used to store data in in-memorry
export default class Store {
  constructor() {

    if (Store._instance) {
      Store._instance._data = {};
      Store._instance._index = {};
      Store._instance._rawData = {};
      Store._instance._cacheDate = {};

      return Store._instance
    }
    this._data = {};
    this._index = {};
    this._rawData = {};
    this._cacheDate = {};
    Store._instance = this;

  }

  setCache(query, result) {
    this._cacheDate[query] = result;
  }

  removeCache() {
    this._cacheDate = {};
  }

  set(id, data, raw, index) {
    this._data[id] = data;
    this._index[id] = index;
    this._rawData[id] = raw;
  }

  remove(id) {
    delete this._data[id];
    delete this._index[id];
    delete this._rawData[id];
  }

  getIndex() {
    return this._index;
  }

  getData() {
    return this._data;
  }

  getRaw() {
    return this._rawData;
  }

  getCache(query) {
    return this._cacheDate[query] || [];
  }
}