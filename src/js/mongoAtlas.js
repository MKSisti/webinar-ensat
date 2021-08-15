import * as Realm from 'realm-web';
const realmApp = new Realm.App({ id: 'webensat-tzkat' });
const assert = require('assert');

class MongoDriver {
  constructor() {
    this.connected = false;
  }

  async connect() {
    const credentials = Realm.Credentials.apiKey('JqpnSeIDwbamBxoyHMyiZTXI11xyemERCdqoBTquXbZ8TNDFABAZEkKB9MKiq5sF');
    try {
      const user = await realmApp.logIn(credentials);
      assert(user.id === realmApp.currentUser.id);
      this.client = realmApp.currentUser.mongoClient("mongodb-atlas");
      this.connected = true;
    } 
    catch (e) {
      console.error('Failed to log in', e);
      this.connected = false;
    }
  }

  async init() {
    if(!this.connected) {
        await this.connect();
        this.titleIndexes = this.client.db('WebEnsat1').collection('titles');
    }
    return this.titleIndexes;
  } 
}

export { MongoDriver };
