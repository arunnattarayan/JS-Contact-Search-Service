// Start your code here!
// You should not need to edit any other existing files (other than if you would like to add tests)
// You do not need to import anything as all the necessary data and events will be delivered through
// updates and service, the 2 arguments to the constructor
// Feel free to add files as necessary
import Store from './store';
import ETL from './etl';
export default class {
  constructor(updates, service) {
    this.service = service;
    this.updates = updates;
    this.initListener();
    this.store = new Store();
    this.etl = new ETL(this);
  }

  setStore(id, data) {
    let raw = { ...data };
    let indexData = this.generateIndex(data)
    data = this.etl.generateData(data);
    this.store.set(id, data, raw, indexData);
  }

  removeStore(id) {
    this.store.remove(id);
  }

  generateIndex(data) {
    let indexies = [];
    for (const [key, value] of Object.entries(data)) {
      let index = this.removeSpecialChars(value);
      index ? indexies.push(index) : null;
    }
    return indexies;
  }

  addContactListener() {
    this.updates.on('add', async (id) => {
      let data = await this.service.getById(id) || {};
      this.setStore(id, data);
    });
  }

  modifiedContactListener() {
    this.updates.on('change', async (id, field, value) => {
      let data = this.store.getRaw()[id];
      data[field] = value;
      this.setStore(id, data);
      this.store.removeCache();
    });
  }

  removedContactListener() {
    this.updates.on('remove', (id) => {
      this.removeStore(id);
    });
  }

  initListener() {
    this.addContactListener();
    this.modifiedContactListener();
    this.removedContactListener();
  }

  removeSpecialChars(string) {
    return string.replace(/[^a-zA-Z0-9]/g, '');
  }

  queryFilter(query, resultMap) {
    let data = [];
    let dbData = this.store.getData();
    let indexData = this.store.getIndex();
    for (const [id, indexies] of Object.entries(indexData)) {
      if (resultMap.includes(id)) {
        continue;
      }
      indexies.every((index) => {
        if (index.search(query) >= 0) {
          resultMap.push(id);
          data.push(dbData[id]);
        } else {
          return true;
        }
      });
    }
    return data;
  }

  distinct(value, index, self) {
    return self.indexOf(value) === index
  }

  validateQuery(query) {
    return (!query || typeof query !== 'string') ? false : true;
  }

  processQuery(queryStr) {
    let queries = queryStr.split(' ');
    let results = [];
    queries.forEach(query => {
      let resultMap = results.map(doc => doc.id);
      query = this.removeSpecialChars(query);
      let resData = this.queryFilter(query, resultMap);
      this.store.setCache(query, resData);
      results = results.concat(resData);
    });
    return results;
  }

  search(queryStr) {
    if(!this.validateQuery(queryStr)) {
      throw 'The Search Query is not valid.'
    }
    let results = this.store.getCache(queryStr);
    if (results.length > 0) {
      return results;
    }
    results = this.processQuery(queryStr);
    this.store.setCache(queryStr, results);
    return results;
  }

}
