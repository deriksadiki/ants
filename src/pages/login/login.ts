import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { StreetartzProvider } from '../../providers/streetart-database/streetart-database';
import { obj } from '../../app/class';
import { ModalController, ViewController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { CategoryPage } from '../category/category';
import { ProfilePage } from '../profile/profile';
import { ForgotPasswordPage } from '../forgot-password/forgot-password'
import { EulaPage } from '../eula/eula';
import { ToastController } from 'ionic-angular';
import firebase from 'firebase';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email;
  password;
  obj = {} as obj;
  errMsg;
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public viewCtrl: ViewController, public art: StreetartzProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  signup() {
    this.navCtrl.setRoot(EulaPage);
  }
  login(email, password) {
    console.log(email,password);
   
    if (email == undefined || email == null 
      && password == undefined) {
      const alert = this.alertCtrl.create({
        title: "Fields empty",
        subTitle: "Please enter your email and password to login.",
        buttons: ['OK'],
        cssClass: "myAlert",
      });
      alert.present();
    }
    else if (email == "" || email == null) {
      const alert = this.alertCtrl.create({
        // title: "No Email",
        subTitle: "The email address field is empty, please insert your email address",
        buttons: ['OK'],
        cssClass: "myAlert",
      });
      alert.present();
    }
    else if (password == "" || password == null) {
      const alert = this.alertCtrl.create({
        // title: "No password",
        subTitle: "The password field is empty, please insert your password.",
        buttons: ['OK'],
        cssClass: "myAlert",
      });
      alert.present();
    }
    else {
 
      this.art.login(email,password).then(() => {
        // this.presentLoading1();
        this.navCtrl.setRoot(CategoryPage);
      }, (error) => {
        // alert("error")
        console.log(error.message);
      })
    }
  }
  presentLoading1() {

  }
  forgotpassword() {
    this.navCtrl.push(ForgotPasswordPage)
  }

  explore(){
    this.navCtrl.setRoot(CategoryPage);
  }

}