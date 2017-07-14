import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { HomePage } from '../home/home';
import { ItemsProvider } from '../../providers/items/items';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  username: string;
  password: string;

  constructor(
    public nav: NavController,
    public http: Http,
    public itemService: ItemsProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {

  }

  login() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let credentials = {
      username: this.username,
      password: this.password
    };

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    loader.present();

    this.http.post('http://10.0.0.205:3000/auth/login', JSON.stringify(credentials), {headers: headers})
      .subscribe(res => {
        this.itemService.init(res.json());
        this.nav.setRoot(HomePage);
      }, (err) => {
        loader.dismiss();

        let alert = this.alertCtrl.create({
          title: 'Login Error',
          subTitle: JSON.parse(err._body).message,
          buttons: ['Dismiss']
        });
        alert.present();

        console.log(err);
      });
  }

  launchSignup() {
    this.nav.push(SignupPage);
  }

}
