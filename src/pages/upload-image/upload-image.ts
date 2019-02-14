import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { StreetartzProvider } from '../../providers/streetart-database/streetart-database';
import { ProfilePage } from '../profile/profile';
import { AlertController } from 'ionic-angular';
import { CategoryPage } from '../category/category';
import { Camera, CameraOptions } from '@ionic-native/camera';
/**
 * Generated class for the UploadImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload-image',
  templateUrl: 'upload-image.html',
})
export class UploadImagePage {
  url = '../../assets/default.jpg';
  name;
  category;
  imageUrl;
  arr = [];
  description;
  location;
  price;
  downloadurl;
  photos: any;
  d = 1;
  constructor(private viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public art: StreetartzProvider, public view: ViewController, public alertCtrl: AlertController, private camera: Camera) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadModalPage');
  }
  insertImagine(event: any) {

    this.d = 1;

    let opts = document.getElementsByClassName('options') as HTMLCollectionOf<HTMLElement>;

    if (this.d == 1) {
      opts[0].style.top = "10vh";
      if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();

        if (event.target.files[0].size > 1500000) {
          let alert = this.alertCtrl.create({
            title: "Oh no!",
            subTitle: "your photo is too large, please choose a photo with 1.5MB or less.",
            buttons: ['OK'],
            cssClass: "myAlert",
          });
          alert.present();
        }
        else {
          reader.onload = (event: any) => {
            this.url = event.target.result;
          }
          reader.readAsDataURL(event.target.files[0]);
        }

      }

    }
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k >= 48 && k <= 57));
  }
  takepic = function () {
    this.d = 1;

    let opts = document.getElementsByClassName('options') as HTMLCollectionOf<HTMLElement>;

    if (this.d == 1) {
      opts[0].style.top = "10vh";

    }
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.url = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });

  }
  uploadPicture() {
    if (this.category == undefined || this.category == null,
      this.name == undefined || this.name == null,
      this.description == undefined || this.description == null,
      this.location == undefined || this.location == null,
      this.price == undefined || this.price == null,
      this.url == '../../assets/default.jpg') {
      const confirm = this.alertCtrl.create({
        title: "Fields Missing",
        subTitle: "Please make sure that all fields are filled.",
        cssClass: "myAlert",
        buttons: [
          {
            text: 'Ok',
            handler: () => {
            }
          },
        ]
      });
      confirm.present();
    } else if (this.category == null || this.category == undefined) {
      const confirm = this.alertCtrl.create({
        title: "category",
        subTitle: "you did not select the category",
        buttons: [
          {
            text: 'Ok',
            handler: () => {
            }
          },
        ]
      });
      confirm.present();
    }
    else if (this.price.length > 11 || this.price.length == "") {
      const confirm = this.alertCtrl.create({
        title: "price",
        subTitle: "the price should not be more than 9999",
        cssClass: "myAlert",
        buttons: [
          {
            text: 'Ok',
            handler: () => {
            }
          },
        ]
      });
      confirm.present();
    } else if (this.url == '../../assets/default.jpg') {
      const confirm = this.alertCtrl.create({
        // title: "uploadImage",
        subTitle: "please select a imagine to continue..",
        cssClass: "myAlert",
        buttons: [
          {
            text: 'Ok',
            handler: () => {
            }
          },
        ]
      });
      confirm.present();
    }
    else if (this.location == null || this.location == undefined) {
      const confirm = this.alertCtrl.create({
        title: "location",
        subTitle: "please select a location to continue..",
        cssClass: "myAlert",
        buttons: [
          {
            text: 'Ok',
            handler: () => {
            }
          },
        ]
      });
      confirm.present();
    }
    else if (this.name == null || this.location == undefined) {
      const confirm = this.alertCtrl.create({
        title: "name",
        subTitle: "please select a name to continue..",
        cssClass: "myAlert",
        buttons: [
          {
            text: 'Ok',
            handler: () => {
            }
          },
        ]
      });
      confirm.present();
    }
    else if (this.description == null || this.description == undefined) {
      const confirm = this.alertCtrl.create({
        title: "description",
        subTitle: "please select a description to continue..",
        cssClass: "myAlert",
        buttons: [
          {
            text: 'Ok',
            handler: () => {
            }
          },
        ]
      });
      confirm.present();
    }
    else {
      this.art.uploadPic(this.url).then(data => {
        this.art.storeToDB(data, this.category, this.name, this.description, this.location, this.price).then(() => {
          const confirm = this.alertCtrl.create({
            title: "Thank you",
            subTitle: "Your artwork will be available on the app as soon as it has been approved",
            cssClass: "myAlert",
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.navCtrl.push(ProfilePage)
                }
              },
            ]
          });
          confirm.present();
        })
        // this.navCtrl.pop();
      },
        Error => {
          // console.log(Error)
        })


    }

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  showAction(event) {
    this.d = 0;
    console.log(event.type + " button");

    let action = document.getElementsByClassName('options') as HTMLCollectionOf<HTMLElement>;
    if (this.d == 0) {
      action[0].style.top = "-30vh";
      action[0].style.transition = 500 + "ms";
    }



  }
  decide(res) {
    // console.log('clicked body');
    res = this.d++;

    if (res > 0) {
      let dropAction = document.getElementsByClassName('options') as HTMLCollectionOf<HTMLElement>;
      dropAction[0].style.top = "10vh";
    }


  }
}