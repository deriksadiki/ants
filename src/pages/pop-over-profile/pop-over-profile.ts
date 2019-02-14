import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { StreetartzProvider } from '../../providers/streetart-database/streetart-database';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { LoginPage } from '../login/login';
import { AlertController } from 'ionic-angular';
import { obj } from '../../app/class';
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the PopOverProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pop-over-profile',
  templateUrl: 'pop-over-profile.html',
})
export class PopOverProfilePage {
  // obj;
  verified
  constructor(public viewCrtl: ViewController, public navCtrl: NavController, public navParams: NavParams, public art: StreetartzProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopOverProfilePage');
  }
  nextpage() {
    this.verified = this.art.verify();
    if (this.verified == 0) {
      let alert = this.alertCtrl.create({
        title: 'Email Verification',
        message: 'We have sent you a verification mail, Please activate your account with the link in the mail. If you cannot find the mail, please click send so that we can resend it.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel');
            }
          },
          {
            text: 'Send',
            handler: () => {
              this.art.sendVerificationLink();
            }
          }
        ]
      });
      alert.present();

    }
    else {
      this.navCtrl.push(EditProfilePage);
      this.viewCrtl.dismiss();
    }
  }
  logout() {
    this.art.logout().then(() => {
      this.navCtrl.push(LoginPage);
    }, (error) => {
      console.log(error.message);
    })
  }








}
