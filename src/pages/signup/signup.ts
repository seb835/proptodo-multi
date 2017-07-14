import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ItemsProvider } from '../../providers/items/items';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;

  constructor(
    public nav: NavController,
    public http: Http,
    public itemService: ItemsProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {

  }

  register() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    };

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    loader.present();

    this.http.post('http://10.0.0.205:3000/auth/register', JSON.stringify(user), {headers: headers})
      .subscribe(res => {
        this.itemService.init(res.json());
        this.nav.setRoot(HomePage);
      }, (err) => {
        loader.dismiss();

        // Parse the error/validation message
        let err_obj = JSON.parse(err._body);
        let err_msg = err_obj['error'];

        if (err_obj['validationErrors']) {
          err_msg += "<br /><ul>";
          for (let key in err_obj['validationErrors']) {
            err_msg += "<li>"+err_obj['validationErrors'][key][0]+"</li>";
          }
          err_msg += "</ul>";
        }

        let alert = this.alertCtrl.create({
          title: 'Registration Error',
          subTitle: err_msg,
          buttons: ['Dismiss']
        });
        alert.present();

        console.log(err);
      });
  }
}
