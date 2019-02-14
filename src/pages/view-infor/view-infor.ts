import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import firebase from 'firebase';
import { StreetartzProvider } from '../../providers/streetart-database/streetart-database';
/**
 * Generated class for the ViewInforPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-infor',
  templateUrl: 'view-infor.html',
})
export class ViewInforPage {
  downloadurl;
  tempName;
  price;
  name1;
  email;
  message = "";
  tempdownloadurl;
  list = [];
  currentUserId;
  arrMsg = [];
  currentUser;
  uid: any;
  primaryKey;
  key
  foreignKey;
  path;
  condition = "";
  obj = this.navParams.get("obj");
  artKey;
  constructor(public navCtrl: NavController, public navParams: NavParams, private emailComposer: EmailComposer, public art: StreetartzProvider) {

  }

  ionViewDidEnter() {
    this.obj = this.navParams.get("obj");
    this.downloadurl = this.obj.pic;
    this.email = this.obj.email;
    this.price = this.obj.price;
    this.name1 = this.obj.name1;
    this.key = this.obj.key
    this.tempdownloadurl = this.obj.tempdownloadurl
    this.tempName = this.obj.tempName;
    this.currentUserId = this.obj.currentUserId;
    this.uid = this.obj.uid;
    this.currentUser = this.obj.currentUser
    this.path = this.obj.path;
    this.list.length = 0;
    this.getData(this.path);

  }

  send() {
    if (this.message != "") {
      this.arrMsg = [];
      this.art.sendMessage(this.path, this.message, this.artKey).then((data) => {
        console.log(data);
        this.getData(this.path)
        this.message = "";
      })
    }

  }

  assignArtKey(key) {
    this.artKey = key;
  }

  showDetails(currentUserId) {
    let obj = {
      currentUserId: currentUserId
    }
    this.navCtrl.push(ViewInforPage, { obj: obj });
  }

  getData(path) {
    // this.arrMsg.length = 0;
    // console.log(this.arrMsg);
    // console.log('nothing man');
    // this.art.retrieveChats(this.uid, this.currentUserId, this.message, this.key).then((data: any) => {
    //   this.arrMsg = data;
    //   this.message = "";
    // })
    console.log(path)
    this.arrMsg.length = 0;
    this.art.retrieveAllChats(path).then((data: any) => {
      this.arrMsg.length = 0;
      this.arrMsg = data;
      this.assignArtKey(this.arrMsg[0].artKey)
      console.log(this.arrMsg);
    })

  }



}
