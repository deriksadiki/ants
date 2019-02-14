import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { StreetartzProvider } from "../../providers/streetart-database/streetart-database";
import { EditProfilePage } from "../edit-profile/edit-profile";
import { LoginPage } from "../login/login";
import { AlertController } from "ionic-angular";
import { obj } from "../../app/class";
import { LoadingController } from "ionic-angular";

/**
 * Generated class for the PopOverProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-pop-over-profile",
  templateUrl: "pop-over-profile.html"
})
export class PopOverProfilePage {
  // obj;
  constructor(
    public viewCrtl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public art: StreetartzProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopOverProfilePage');
  }
  verified;
  nextpage() {
    this.verified = this.art.verify();
    if (this.verified == 0) {
      let alert = this.alertCtrl.create({
        title: "Email not verified",
        message:
          "Your email hasn't been verified yet, please check your mail or click 'Resend' to get a new verification link.",
        cssClass: "myAlert",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              console.log("Cancel");
            }
          },
          {
            text: "Resend",
            handler: () => {
              this.art.checkVerificatiom();
            }
          }
        ]
      });
      alert.present();
      this.viewCrtl.dismiss();
    } else {
      this.navCtrl.push(EditProfilePage);
      this.viewCrtl.dismiss();
    }
  }
  logout() {
    this.art.logout().then(
      () => {
        this.navCtrl.push(LoginPage);
      },
      error => {
        console.log(error.message);
      }
    );
  }
}
