class localStorage {
  constructor(expire) {
    this.expire = expire || 300 * 1000;
    this.lf = require('localforage');
  }

  async get(key) {
    const data = await this.lf.getItem(key);

    if (!data) return data;

    const { expire, value } = data;

    if (expire < Date.now()) {
      localForage.removeItem(key);
      return null;
    }

    return value;
  }

  async set(key, value) {
    return this.lf.setItem(key, { expire, value });
  }
}

export { localStorage };
