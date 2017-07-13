import { Injectable, NgZone } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable()
export class ItemsProvider {

  data: any;
  db: any;
  remote: any;

  constructor(public zone: NgZone) {

  }

  init(details) {
    this.db = new PouchDB('proptodo-auth');

    this.remote = details.userDBs.supertest;

    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.db.sync(this.remote, options);

    console.log(this.db);
  }

  logout() {
    this.data = null;

    this.db.destroy().then(() => {
      console.log("database removed");
    });
  }

  getItems() {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.db.allDocs({
        include_docs: true
      }).then((result) => {
        this.data = [];

        let docs = result.rows.map((row) => {
          this.data.push(row.doc);
        });

        resolve(this.data);

        this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          this.handleChange(change);
        });
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  createItem(item) {
    this.db.post(item);
  }

  updateItem(item) {
    this.db.put(item).catch((err) => {
      console.log(err);
    });
  }

  deleteItem(item) {
    this.db.remove(item).catch((err) => {
      console.log(err);
    });
  }

  handleChange(change) {
    let changedDoc = null;
    let changedIndex = null;

    this.data.forEach((doc, index) => {
      if (doc._id === change.id) {
        changedDoc = doc;
        changedIndex = index;
      }
    });

    // Wrap changes in a zone to help with async operations
    this.zone.run(() => {
      if (change.deleted) {
        // A document was deleted
        this.data.splice(changedIndex, 1);
      } else {
        // A document was updated
        if (changedDoc) {
          this.data[changedIndex] = change.doc;
        } else {
          // A document was added
          this.data.push(change.doc);
        }
      }
    });
  }

}
