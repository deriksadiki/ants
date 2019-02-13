import { Component, ChangeDetectorRef, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StreetartzProvider } from '../../providers/streetart-database/streetart-database';
import { obj } from '../../app/class';
import { ProfilePage } from '../profile/profile';
import { ViewPage } from '../view/view';
import firebase from 'firebase';
import { AlertController } from 'ionic-angular';
import { LoadingController, ModalController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ToastController } from 'ionic-angular';
import { App } from 'ionic-angular';
import { ChatsPage } from '../chats/chats';
import { Network } from '@ionic-native/network';


/**
 * Generated class for the CategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  obj = {} as obj
  category: any;
  categoryArr = [];
  uid: any;
  list = [];
  name;
  username;
  comments;
  userId;
  verified;
  constructor(private ngZone: NgZone, private modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public art: StreetartzProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public appCtrl: App, public network: Network) {
    this.retreivePics();
  }
  GoToProfilePage() {
    this.navCtrl.push(ProfilePage)
  }

  ionViewDidEnter() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      let alert = this.alertCtrl.create({
        title: '',
        subTitle: 'network was disconnected ',
        buttons: ['OK']
      });
      alert.present();
    });

    let connectSubscription = this.network.onConnect().subscribe(() => {
      let alert = this.alertCtrl.create({
        title: '',
        subTitle: 'network connection has been established',
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  typeOfArt() {
    this.art.selectCategory(this.category).then((data) => {
      if (data == undefined || data == null) {
        console.log('empty')
      }
      else {
        this.categoryArr.length = 0;
        var keys: any = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          if (this.category == data[k].category) {
            let obj = {
              category: data[k].category,
              downloadurl: data[k].downloadurl,
              name: data[k].name,
              key: k,
              url: data[k].url,
              uid: data[k].uid,
              comments: data[k].comments,
              username: data[k].username,
              likes: data[k].likes,
              email: data[k].email,
              location: data[k].location,
              price: data[k].price,
            }
            this.categoryArr.push(obj);
            // console.log(this.categoryArr);
            this.categoryArr.reverse();
          }
        }
      }
      if (this.category == "All") {
        this.categoryArr.length = 0;
        this.art.viewPicMain().then((data: any) => {
          this.categoryArr = data;
          this.categoryArr.reverse();
        })
      }
    })
  }
  retreivePics() {
    this.art.viewPicMain().then((data: any) => {
      this.categoryArr = data;
      this.categoryArr.reverse();
    })
  }
  pushArtistDetails(pic, name, key, url, comments, email, username, description, location, price, likes, name1, uid) {
    let obj = {
      name: name,
      pic: pic,
      key: key,
      url: url,
      comments: comments,
      email: email,
      username: username,
      description: description,
      location: location,
      price: price,
      likes: likes,
      name1: name1,
      uid: uid,
    }
    this.navCtrl.push(ViewPage, { obj: obj });

  }
  chats() {
    // this.verified = this.art.verify();
    // if (this.verified == 0) {
    //   let alert = this.alertCtrl.create({
    //     title: 'Email Verification',
    //     message: 'We have sent you a verification mail, Please activate your account with the link in the mail. If you cannot find the mail, please click send so that we can resend it.',
    //     buttons: [
    //       {
    //         text: 'Cancel',
    //         role: 'cancel',
    //         handler: () => {
    //           console.log('Cancel');
    //         }
    //       },
    //       {
    //         text: 'Send',
    //         handler: () => {
    //           this.art.checkVerificatiom();
    //         }
    //       }
    //     ]
    //   });
    //   alert.present();

    // }
    // else {
    this.navCtrl.push(ChatsPage)
    // }
  }

}