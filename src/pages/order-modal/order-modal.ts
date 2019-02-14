import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import { StreetartzProvider } from '../../providers/streetart-database/streetart-database';
import { ViewInforPage } from '../view-infor/view-infor';


/**;
 * Generated class for the OrderModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-modal',
  templateUrl: 'order-modal.html',
})
export class OrderModalPage implements OnInit {
  username;
  downloadurl;
  keys2;
  downloadurl1;
  email;
  name;
  name1;
  description;
  price;
  location;
  numlikes;
  numComments;
  message = "";
  arr = [];
  tempName;
  uid: any;
  tempdownloadurl;
  tempemail;
  height;
  retriveCustomerDetails = [];
  display = [];
  currentUserId;
  arrMsg = [];
  messageRead = "message read"
  obj = this.navParams.get("obj");

  constructor(public navCtrl: NavController, public navParams: NavParams, public art: StreetartzProvider, public toastCtrl: ToastController) {
    this.obj = this.navParams.get("obj");
    this.username = this.obj.username;
    this.downloadurl = this.obj.pic;
    this.keys2 = this.obj.key;
    this.downloadurl1 = this.obj.url
    this.numComments = this.obj.comments;
    this.email = this.obj.email;
    this.name = this.obj.name;
    this.description = this.obj.description;
    this.location = this.obj.location;
    this.price = this.obj.price;
    this.numlikes = this.obj.likes;
    this.name1 = this.obj.name1;
    this.uid = this.obj.uid;
    this.currentUserId = this.obj.currentUserId;
    this.art.returnUID().then((data) => {
      this.tempName = data[0].name;
      this.tempdownloadurl = data[0].downloadurl;



    })
    this.getData();
  }



  ionViewDidEnter() {
    this.getData();
    console.log(this.arrMsg)
  }
  ngOnInit() {
    this.art.returnUID().then((data) => {
      this.tempName = data[0].name;
      this.tempdownloadurl = data[0].downloadurl;
      this.tempemail = data[0].email;
      this.imageSize()
    })
  }

  scan(event) {
    var wMark = document.getElementsByClassName('watermark') as HTMLCollectionOf<HTMLElement>;
    wMark[0].style.top = (event.path[0].attributes[1].ownerElement.height / 2.5) + "px";
    wMark[0].style.transform = "TranslateY(-50px)"
  }
  scanner(event) {
    var wMark = document.getElementsByClassName('watermarks') as HTMLCollectionOf<HTMLElement>;
    this.height = event.path[0].clientHeight;
    wMark[0].style.top = (this.height / 3) + "px";
    wMark[0].style.transform = "translateY(-50px)";
    wMark[0].style.width = 100 + "%";


  }
  imageSize() {
    setTimeout(() => {
    }, 3000);
  }
  sendRequest(currentUserId) {

    let sentMessage = document.getElementsByClassName('message') as HTMLCollectionOf<HTMLElement>;
    let info = document.getElementsByClassName('data') as HTMLCollectionOf<HTMLElement>;
    info[0].style.transform = "translateX(120%)";
    info[0].style.height = 0 + "px";
    sentMessage[0].style.display = "block";
  }

  BuyArt(pic, name, key, url, email, username, price, name1, uid, currentUserId) {
    let obj = {
      name: name,
      pic: pic,
      key: key,
      url: url,
      email: email,
      username: username,
      location: location,
      price: price,
      name1: name1,
      uid: uid,
      currentUserId: currentUserId
    }
    this.navCtrl.push(ViewInforPage, { obj: obj });

  }
  retrieveINformation() {
    firebase.database().ref('Orders/' + this.obj.uid).on("value", (data: any) => {
      data = data.val();
      this.retriveCustomerDetails.push(data);
    })
  }

  sendMesssage() {
    if (this.message != "") {
      let a = this.obj.uid;
      var tempMsg = this.message;
      this.message = "";
      if (a == this.currentUserId) {
      }
      this.art.BuyPicture(this.obj.uid, this.currentUserId, tempMsg, this.keys2).then((data: any) => {
        this.arrMsg = data;
        this.message = "";
        this.getData()
      })
    }

  }
  getData() {
    this.arrMsg.length = 0;
    console.log(this.arrMsg);
    console.log('nothing man');
    this.art.retrieveChats(this.obj.uid, this.currentUserId, this.message, this.keys2).then((data: any) => {
      this.arrMsg = data;
      this.message = "";
    })
  }
}
