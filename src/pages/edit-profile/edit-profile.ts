import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { StreetartzProvider } from '../../providers/streetart-database/streetart-database';
import { LoadingController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { ToastController } from 'ionic-angular';
import { ChangeDetectorRef } from '@angular/core';
/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage implements OnInit {
  arr = [];
  obj;
  email: any;
  name: any;
  file;
  bio;
  contact;
  skill;
  uid;
  uid1;
  url;
  details
  downloadurl
  imageUrl: any;

  constructor(public cdRef: ChangeDetectorRef, public navCtrl: NavController, public navParams: NavParams, public art: StreetartzProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController) {

  }
  GoToProfile() {
    this.navCtrl.setRoot(ProfilePage);
  }
  ionViewDidLoad() {
    this.retreivePics1();
  }
  ngOnInit() {
    this.art.retrieve().on('value', (data: any) => {
      let details = data.val();
      this.name = details.name;
      this.email = details.email
      this.contact = details.contact
      this.downloadurl = details.downloadurl
      this.bio = details.bio
    })
  }

  change(value) {
    this.cdRef.detectChanges();
    this.contact = value.length < 10 ? value.substring(0, 10) : value;
  }


  insertpic(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.downloadurl = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }

  }
  uploadPicture() {
    this.arr.length = 0;
    if (this.contact.length < 10 || this.contact.length > 10) {
      const alert = this.alertCtrl.create({
        title: "Oops!",
        subTitle: "Please make sure that your mobile number is correct.",
        buttons: ['OK']
      });
      alert.present();
    }
    else {
      this.art.uploadProfilePic(this.downloadurl, this.name).then(data => {
        console.log('added to db');
        this.art.update(this.name, this.email, this.contact, this.bio, this.downloadurl).then((data) => {
          this.arr.push(data);
        })
        this.navCtrl.pop();
      },
        Error => {
          // console.log(Error)
        })
    }
  }
  getUid1() {
    this.art.getUserID().then(data => {
      this.uid1 = data
    })
  }


  retreivePics1() {
    this.arr.length = 0;
    this.getUid1();
    this.art.viewPicGallery1().then(data => {
      var keys: any = Object.keys(data);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (this.uid == data[k].uid) {
          let objt = {
            downloadurl: data[k].downloadurl
          }
          this.arr.push(objt);
        }
      }

    }, Error => {
      console.log(Error)
    });
  }

}