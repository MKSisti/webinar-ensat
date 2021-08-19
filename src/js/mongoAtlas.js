import * as Realm from 'realm-web';
const realmApp = new Realm.App({ id: 'webensat-tzkat' });

const assert = require('assert');
var EventEmitter = require('events');
class MongoDriver {
  constructor() {
    this.connected = false;
    this._collections = {};
    this._watchers = {};
    this._events = new EventEmitter();
  }

  async connect() {
    const credentials = Realm.Credentials.apiKey('JqpnSeIDwbamBxoyHMyiZTXI11xyemERCdqoBTquXbZ8TNDFABAZEkKB9MKiq5sF');
    try {
      const user = await realmApp.logIn(credentials);
      assert(user.id === realmApp.currentUser.id);
      this.client = realmApp.currentUser.mongoClient('mongodb-atlas');
      this.connected = true;
      console.log('connected to db');
    } catch (e) {
      console.error('Failed to log in', e);
      this.connected = false;
    }
  }

  async init(col) {
    if (!this.connected) await this.connect();
    if (!this._collections[col]) this._collections[col] = this.client.db('WebEnsat1').collection(col);
    console.log(col,'connected');
    return this._collections[col];
  }

  /**
   *
   * @param {string} col - collection to query
   * @param {Object} filter - (optional) filter object example: {pid: x, title: y}
   * @param {string} sort - (optional) sort object example: {pid: 1} to sort pid asc or {pid: -1} for desc, can also be multiple keys
   * @param {integer} limit  - (optional) number of elements to get
   * @param {integer} offset - (optional) number of elements to skip
   * @returns array of elements that match query
   */
  async get(col, filter, sort, limit, offset) {
    if (!this._collections[col]) this.init(col);

    if (filter)
      for (let f of Object.keys(filter)) {
        filter[f] = { $regex: filter[f], $options: 'i' };
      }

    let res = await this._collections[col].find(filter, {
      sort,
      limit:500
    });

    if (limit != null && offset != null) return res.splice(offset,limit);
    return res;
  }

  /**
   *
   * @param {string} col - collection to insert one item into
   * @param {Object} data - data to insert
   * @returns null
   */
  async insert(col, data) {
    if (!this._collections[col]) this.init(col);
    await this._collections[col].insertOne(data);
  }

  /**
   *
   * @param {string} col - collection to update one item in
   * @param {Object} filter - filter object example: {pid: x, title: y}
   * @param {Object} data - data to update
   * @returns null
   */
  async update(col, filter, data) {
    if (!this._collections[col]) this.init(col);
    await this._collections[col].updateOne(filter, { $set: data });
  }

  /**
   *
   * @param {string} col - collection to delete one item from
   * @param {Object} filter - filter object example: {pid: x, title: y}
   * @returns null
   */
  async delete(col, filter) {
    if (!this._collections[col]) this.init(col);
    await this._collections[col].deleteOne(filter);
  }

  /**
   *
   * @param {string} col - collection to start watching
   * @returns null
   */
  async _watch(col) {
    if (!this._collections[col]) this.init(col);

    this._watchers[col] = Date.now();
    for await (const change of this._collections[col].watch()) {
      this._events.emit(col, change.operationType, change);
    }
  }

  /**
   *
   * @param {string} col - collection to watch
   * @param {Object} fn - callback function to run on event
   * @returns null
   */
  async on(col, fn) {
    if (!this._watchers[col]) this._watch(col);
    this._events.on(col, fn);
  }

  /**
   *
   * @param {string} col - collection to watch once
   * @param {Object} fn - callback function to run on event once
   * @returns null
   */
  async once(col, fn) {
    if (!this._watchers[col]) this._watch(col);
    this._events.once(col, fn);
  }

  /**
   *
   * @param {string} col - collection to remove watchers from
   * @returns null
   */
  off(col) {
    this._events.removeListener(col);
  }
}

export { MongoDriver };
