import { Component } from "@angular/core";
import { NavController, AlertController } from 'ionic-angular';
import { ItemsProvider } from '../../providers/items/items';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: any;

  constructor(public nav: NavController, public itemService: ItemsProvider, public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    this.itemService.getItems().then((data) => {
      this.items = data;
    });
  }

  logout() {
    this.itemService.logout();
    this.items = null;
    this.nav.setRoot(LoginPage);
  }

  createItem() {
    let prompt = this.alertCtrl.create({
      title: 'Add',
      message: 'What do you need to do?',
      inputs: [
        {
          name: 'title'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.itemService.createItem({title: data.title});
          }
        }
      ]
    });

    prompt.present();
  }

  updateItem(item) {
    let prompt = this.alertCtrl.create({
      title: 'Edit',
      message: 'Change your mind?',
      inputs: [
        {
          name: 'title',
          value: item.title
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.itemService.updateItem({
              _id: item._id,
              _rev: item._rev,
              title: data.title
            });
          }
        }
      ]
    });

    prompt.present();
  }

  deleteItem(item) {
    this.itemService.deleteItem(item);
  }

}
