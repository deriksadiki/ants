import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { LoginPage } from "../../pages/login/login";
import { obj } from "../../app/class";
import { AlertController } from "ionic-angular";
import { LoadingController } from "ionic-angular";
import { ToastController } from "ionic-angular";
import firebase from "firebase";
import moment from "moment";
import { dateDataSortValue } from "ionic-angular/util/datetime-util";
import { empty } from "rxjs/Observer";
import { AbstractClassPart } from "@angular/compiler/src/output/output_ast";
/*
  Generated class for the StreetartzProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StreetartzProvider {
  key: string;
  obj = {} as obj;
  arr = [];
  category;
  keyArr = [];
  arr2 = [];
  data = [];
  list = [];
  PicUrl;
  ProfilePic: any;
  countComment;
  name;
  url;
  downloadurl;
  username;
  selectCategoryArr = [];
  emailComposer;
  email;
  password;
  condition;
  likeArr = [];
  stayLoggedIn;
  ProfileArr;
  storeProfilePic = [];
  pushArr = [];
  DisplayArrUploads = [];
  removepic = [];
  returnCurrentUser = [];
  retriveCustomerDetails = [];
  arrMssg = [];
  constructor(
    private ngzone: NgZone,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
    console.log("Hello StreetartzProvider Provider");
  }
  checkstate() {
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
        firebase.auth().onAuthStateChanged(user => {
          if (user != null) {
            this.stayLoggedIn = 1;
          } else {
            this.stayLoggedIn = 0;
          }
          resolve(this.stayLoggedIn);
        });
      });
    });
  }
  logout() {
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
        firebase
          .auth()
          .signOut()
          .then(
            () => {
              resolve();
            },
            error => {
              reject(error);
            }
          );
      });
    });
  }

  checkVerificatiom() {
    var user = firebase.auth().currentUser;
    if (user.emailVerified == false) {
      user.sendEmailVerification();
      let alert = this.alertCtrl.create({
        title: "",
        subTitle:
          "We have sent you an email with a verification link, click the link on the email to verify your account.",
        buttons: ["OK"],
        cssClass: "myAlert"
      });
      alert.present();
      return 0;
    } else {
      return 1;
    }
  }

  verify() {
    console.log("checking ferification");
    var user = firebase.auth().currentUser;
    console.log(user);
    if (user.emailVerified == false) {
      return 0;
    } else {
      return 1;
    }
  }

  register(email, password, name) {
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
        let loading = this.loadingCtrl.create({
          spinner: "bubbles",
          content: "Signing in....",
          duration: 4000000,
          cssClass: "myAlert1"
        });
        loading.present();
        return firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(newUser => {
            var user = firebase.auth().currentUser;
            firebase
              .database()
              .ref("profiles/" + user.uid)
              .set({
                name: name,
                email: email,
                contact: "",
                downloadurl: "../../assets/download.png",
                bio:
                  "You have not yet inserted a description about your skills and abilities, update profile to get started."
              });
            resolve();
            loading.dismiss();
          })
          .catch(error => {
            loading.dismiss();
            const alert = this.alertCtrl.create({
              subTitle: error.message,
              cssClass: "myAlert",
              buttons: [
                {
                  text: "ok",
                  handler: data => {
                    console.log("Cancel clicked");
                  }
                }
              ]
            });
            alert.present();
            console.log(error);
          });
      });
    });
  }
  login(email, password) {
    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Sign In....",
      duration: 4000000
    });
    loading.present();
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            resolve();
            loading.dismiss();
          })
          .catch(error => {
            loading.dismiss();
            if (
              error.message ==
              "There is no user record corresponding to this identifier. The user may have been deleted."
            ) {
              const alert = this.alertCtrl.create({
                subTitle:
                  "It seems like you have not registered to use StreetArt, please check your login information or sign up to get started",
                cssClass: "myAlert",
                buttons: [
                  {
                    text: "ok",
                    handler: data => {
                      console.log("Cancel");
                    }
                  }
                ]
              });
              alert.present();
            } else {
              const alert = this.alertCtrl.create({
                subTitle: error.message,
                cssClass: "myAlert",
                buttons: [
                  {
                    text: "ok",
                    handler: data => {
                      console.log("Cancel");
                    }
                  }
                ]
              });
              alert.present();
            }
          });
      });
    });
  }
  retrieve() {
    let userID = firebase.auth().currentUser;
    return firebase.database().ref("profiles/" + userID.uid);
  }
  profile() {
    this.ProfileArr.length = 0;
    return new Promise((pass, fail) => {
      this.ngzone.run(() => {
        let userID = firebase.auth().currentUser;
        firebase
          .database()
          .ref("profiles/" + userID.uid)
          .on("value", (data: any) => {
            let details = data.val();
            this.ProfileArr.push(details);
          });
        pass(this.ProfileArr);
      });
    });
  }
  forgotpassword(email) {
    return new Promise((resolve, reject) => {
      if (email == null || email == undefined) {
        const alert = this.alertCtrl.create({
          subTitle: "Please enter your Email.",
          buttons: ["OK"],
          cssClass: "myAlert"
        });
        alert.present();
      } else if (email != null || email != undefined) {
        firebase
          .auth()
          .sendPasswordResetEmail(email)
          .then(
            () => {
              const alert = this.alertCtrl.create({
                title: "Password request Sent",
                subTitle:
                  "We've sent you and email with a reset link, go to your email and click the link to recover your account.",
                buttons: ["OK"],
                cssClass: "myAlert"
              });
              alert.present();
              resolve();
            },
            Error => {
              const alert = this.alertCtrl.create({
                subTitle: Error.message,
                buttons: ["OK"],
                cssClass: "myAlert"
              });
              alert.present();
              resolve();
            }
          );
      }
    }).catch(error => {
      const alert = this.alertCtrl.create({
        subTitle: error.message,
        cssClass: "myAlert",
        buttons: [
          {
            text: "ok",
            handler: data => {
              console.log("Cancel clicked");
            }
          }
        ]
      });
      alert.present();
    });
  }
  uploadPic(pic) {
    var name = "SA" + Date.now();
    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Please wait",
      duration: 8000
    });
    const toast = this.toastCtrl.create({
      message: "your imagine had been uploaded!",
      duration: 3000
    });
    loading.present();
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        firebase
          .storage()
          .ref(name + "jpg")
          .putString(pic, "data_url")
          .then(
            () => {
              // toast.present();
              accpt(name);
              console.log(name);
            },
            Error => {
              rejc(Error.message);
            }
          );
      });
    });
  }
  storeToDB(name, category, picName, description, location, price) {
    var d = "SA" + Date.now();
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        var storageRef = firebase.storage().ref(name + "jpg");
        storageRef.getDownloadURL().then(
          url => {
            var user = firebase.auth().currentUser;
            var link = url;
            firebase
              .database()
              .ref("Tempuploads/")
              .push({
                downloadurl: link,
                name: picName,
                name1: name,
                category: category,
                uid: user.uid,
                description: description,
                location: location,
                price: price,
                likes: 0,
                comments: 0
              });
            accpt("success");
          },
          Error => {
            rejc(Error.message);
            console.log(Error.message);
          }
        );
      });
    });
  }
  viewPicGallery() {
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        var user = firebase.auth().currentUser;
        firebase
          .database()
          .ref("uploads")
          .on(
            "value",
            (data: any) => {
              if (data.val() != null || data.val() != undefined) {
                var DisplayData = data.val();
                var keys = Object.keys(DisplayData);
                if (DisplayData !== null) {
                }
                for (var i = 0; i < keys.length; i++) {
                  this.storeImgDownloadurl(DisplayData[keys[i]].downloadurl);
                }
                accpt(DisplayData);
              }
            },
            Error => {
              rejc(Error.message);
            }
          );
      });
    });
  }

  getUserID() {
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        var user = firebase.auth().currentUser;
        firebase
          .database()
          .ref("uploads")
          .on(
            "value",
            (data: any) => {
              var a = data.val();
              if (a !== null) {
              }
              accpt(user.uid);
            },
            Error => {
              rejc(Error.message);
            }
          );
      });
    });
  }
  uploadProfilePic(pic, name) {
    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Please wait",
      duration: 2000
    });
    const toast = this.toastCtrl.create({
      message: "data has been updated!",
      duration: 3000
    });
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        toast.present();
        firebase
          .storage()
          .ref(name)
          .putString(pic, "data_url")
          .then(
            () => {
              accpt(name);
              console.log(name);
            },
            Error => {
              rejc(Error.message);
            }
          );
      });
    });
  }

  storeToDB1(name) {
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        this.storeProfilePic.length = 0;
        var storageRef = firebase.storage().ref(name);
        storageRef.getDownloadURL().then(
          url => {
            console.log(url);
            var user = firebase.auth().currentUser;
            var link = url;
            firebase
              .database()
              .ref("profiles/" + user.uid)
              .update({
                downloadurl: link
              });
            accpt("success");
          },
          Error => {
            rejc(Error.message);
            console.log(Error.message);
          }
        );
      });
    });
  }
  viewPicGallery1() {
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        var user = firebase.auth().currentUser;
        firebase
          .database()
          .ref("profiles")
          .on(
            "value",
            (data: any) => {
              var b = data.val();
              var keys = Object.keys(b);
              if (b !== null) {
              }
              this.storeImgur(b[keys[0]].downloadurl);
              accpt(b);
            },
            Error => {
              rejc(Error.message);
            }
          );
      });
    });
  }
  getUserID1() {
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        var userID = firebase.auth().currentUser;
        firebase
          .database()
          .ref("profiles")
          .on(
            "value",
            (data: any) => {
              var b = data.val();
              if (b !== null) {
              }
              console.log(b);
              accpt(userID.uid);
            },
            Error => {
              rejc(Error.message);
            }
          );
      });
    });
  }
  storeImgur(url) {
    this.url = url;
    // console.log(url);
  }
  storeImgDownloadurl(downloadurl) {
    this.downloadurl = downloadurl;
    // console.log(downloadurl);
  }
  storeName(name) {
    this.obj.name = name;
  }

  selectCategory(category) {
    return new Promise((pass, fail) => {
      this.ngzone.run(() => {
        firebase
          .database()
          .ref("uploads")
          .on("value", (data: any) => {
            if (
              data.val() != null ||
              (data.val() != undefined && this.selectCategoryArr != null) ||
              this.selectCategoryArr != undefined
            ) {
              let uploads = data.val();
              this.selectCategoryArr.length = 0;
              var keys2: any = Object.keys(uploads);
              for (var i = 0; i < keys2.length; i++) {
                let k = keys2[i];
                let chckId = uploads[k].uid;
                if (category == uploads[k].category) {
                  let obj = {
                    uid: uploads[k].uid,
                    name: uploads[k].name,
                    name1: uploads[k].name1,
                    category: uploads[k].category,
                    comments: uploads[k].comments,
                    downloadurl: uploads[k].downloadurl,
                    location: uploads[k].location,
                    price: uploads[k].price,
                    likes: uploads[k].likes,
                    email: uploads[k].email,
                    url: this.url,
                    key: k,
                    username: ""
                  };
                  this.selectCategoryArr.push(obj);
                  this.viewProfileMain(chckId).then((profileData: any) => {
                    obj.username = profileData.name;
                    obj.url = profileData.downloadurl;
                    obj.email = profileData.email;
                  });
                }

                if (
                  uploads[k].category == undefined ||
                  uploads[k].category == null
                ) {
                  console.log("nex");
                }
              }
            } else {
              this.selectCategoryArr = null;
              console.log("empty");
            }
          }),
          pass(this.selectCategoryArr);
      });
    });
  }
  update(name, email, contact, bio, downloadurl) {
    this.arr.length = 0;
    return new Promise((pass, fail) => {
      this.ngzone.run(() => {
        var user = firebase.auth().currentUser;
        firebase
          .database()
          .ref("profiles/" + user.uid)
          .update({
            name: name,
            email: email,
            contact: contact,
            bio: bio,
            downloadurl: downloadurl
          });
      });
    });
  }
  push(obj: obj) {
    return new Promise((pass, fail) => {
      this.ngzone.run(() => {
        firebase
          .database()
          .ref("uploads")
          .on("value", (data: any) => {
            let uploads = data.val();
            console.log(uploads);
            if (data == null) {
              this.pushArr = null;
            } else {
              var keys: any = Object.keys(uploads);
              for (var j = 0; j < keys.length; j++) {
                firebase
                  .database()
                  .ref("uploads")
                  .on("value", (data2: any) => {
                    let uploads2 = data2.val();
                    console.log(uploads2);
                    var keys2: any = Object.keys(uploads2);
                    for (var i = 0; i < keys2.length; i++) {
                      var k = keys2[i];
                      var chckId = uploads[k].uid;
                      if (this.arr == uploads[k].arr) {
                        let obj = {
                          name: uploads[k].name,
                          name1: uploads[k].name1,
                          key: keys2,
                          uid: data[k].uid,
                          downloadurl: uploads[k].downloadurl,
                          url: uploads[k].downloadurl,
                          comments: uploads[k].comments,
                          description: uploads[k].description,
                          location: uploads[k].location,
                          price: uploads[k].price,
                          email: uploads[k].email,
                          likes: data[k].likes,
                          username: uploads[k].username
                        };
                        this.pushArr.push(obj);
                        this.viewProfileMain(chckId).then(
                          (profileData: any) => {
                            obj.email = profileData.email;
                            obj.username = profileData.name;
                          }
                        );
                      }
                      pass(this.pushArr);
                    }
                    this.storeImgur(data[keys2[0]].downloadurl);
                  }),
                  pass(this.pushArr);
              }
            }
          });
      });
    });
  }
  viewPicMain() {
    let loader = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Loading...",
      duration: 4000000000000000000
    });
    loader.present();
    return new Promise((accpt, rejc) => {
      firebase
        .database()
        .ref("uploads")
        .on("value", (data: any) => {
          this.ngzone.run(() => {
            let uploads3 = data.val();
            if (
              data.val() != null ||
              (data.val() != undefined &&
                this.DisplayArrUploads.length != null) ||
              this.arr2 != undefined ||
              uploads3 != null
            ) {
              this.DisplayArrUploads.length = 0;
              let keys1: any = Object.keys(uploads3);
              for (var i = 0; i < keys1.length; i++) {
                let k = keys1[i];
                let chckId = uploads3[k].uid;
                let obj = {
                  uid: uploads3[k].uid,
                  category: uploads3[k].category,
                  downloadurl: uploads3[k].downloadurl,
                  description: uploads3[k].description,
                  location: uploads3[k].location,
                  comments: uploads3[k].comments,
                  price: uploads3[k].price,
                  likes: uploads3[k].likes,
                  name: uploads3[k].name,
                  name1: uploads3[k].name1,
                  email: uploads3[k].email,
                  key: k,
                  username: "",
                  url: this.url
                };
                this.DisplayArrUploads.push(obj);
                this.viewProfileMain(chckId).then((profileData: any) => {
                  obj.username = profileData.name;
                  obj.url = profileData.downloadurl;
                  obj.email = profileData.email;
                });

                this.storeImgur(uploads3[keys1[0]].downloadurl);
              }
            } else {
              this.DisplayArrUploads = null;
              console.log("empty");
            }
          }),
            loader.dismiss();
          accpt(this.DisplayArrUploads);
        });
    });
  }
  viewProfileMain(userid: string) {
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        firebase
          .database()
          .ref("profiles/" + userid)
          .on(
            "value",
            (data: any) => {
              var a = data.val();
              accpt(a);
            },
            Error => {
              rejc(Error.message);
            }
          );
      });
    });
  }
  comments(key: any, comment: any) {
    var user = firebase.auth().currentUser;
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        var day = moment().format("MMMM Do YYYY, h:mm:ss a");
        firebase
          .database()
          .ref("comments/" + key)
          .push({
            comment: comment,
            uid: user.uid,
            date: day,
            url: this.url
          });
        accpt("success");
      });
    });
  }
  viewComments(key: any, comment: string) {
    this.keyArr.length = 0;
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        var user = firebase.auth().currentUser;
        firebase
          .database()
          .ref("comments/" + key)
          .on(
            "value",
            (data: any) => {
              var CommentDetails = data.val();
              if (data.val() == null) {
                this.arr2 = null;
              } else {
                var keys1: any = Object.keys(CommentDetails);
                for (var i = 0; i < keys1.length; i++) {
                  var key = keys1[i];
                  var chckId = CommentDetails[key].uid;
                  let obj = {
                    comment: CommentDetails[key].comment,
                    uid: user.uid,
                    url: this.url,
                    date: moment(
                      CommentDetails[key].date,
                      "MMMM Do YYYY, h:mm:ss a"
                    )
                      .startOf("minutes")
                      .fromNow(),
                    username: ""
                  };
                  accpt(this.keyArr);
                  this.viewProfileMain(chckId).then((profileData: any) => {
                    obj.url = profileData.downloadurl;
                    obj.username = profileData.name;
                    this.keyArr.push(obj);
                  });
                }
              }
            },
            Error => {
              rejc(Error.message);
            }
          );
      });
    });
  }
  addNumOfComments(key, numComments) {
    numComments = numComments + 1;
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        firebase
          .database()
          .ref("uploads/" + key)
          .update({ comments: numComments });
        accpt("comment added");
      });
    });
  }
  likePic(key) {
    var user = firebase.auth().currentUser;
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        firebase
          .database()
          .ref("likes/" + key)
          .push({
            uid: user.uid
          });
        accpt("success");
      });
    });
  }
  viewLikes(key) {
    this.keyArr.length = 0;
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        var user = firebase.auth().currentUser;
        firebase
          .database()
          .ref("likes/" + key)
          .on(
            "value",
            (data: any) => {
              if (data.val() != undefined) {
                var likes = data.val();
                var results = "";
                var keys = Object.keys(likes);
                for (var x = 0; x < keys.length; x++) {
                  firebase
                    .database()
                    .ref("likes/" + key + "/" + keys[x])
                    .on("value", (data2: any) => {
                      if (data2.val() != undefined) {
                        if (user.uid == data2.val().uid) {
                          results = keys[x];
                          accpt(results);
                        } else {
                          results = "not found";
                        }
                      }
                    });
                }
                accpt(results);
              } else {
                accpt("not found");
              }
            },
            Error => {
              rejc(Error.message);
            }
          );
      });
    });
  }
  addNumOfLikes(key, num) {
    num = num + 1;
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        firebase
          .database()
          .ref("uploads/" + key)
          .update({ likes: num });
        accpt("like added");
      });
    });
  }
  removeLike(key: any, num, key1) {
    num = num - 1;
    var user = firebase.auth().currentUser;
    console.log(user.uid);
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        firebase
          .database()
          .ref("uploads/" + key)
          .update({ likes: num });
        firebase
          .database()
          .ref("likes/" + key + "/" + key1)
          .remove();
        accpt("like removed");
      });
    });
  }

  RemoveUploadedPicture(key) {
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        this.removepic.length = 0;
        firebase
          .database()
          .ref("uploads/" + key)
          .remove();
        accpt("image deleted");
      });
    });
  }
  LicenceContract() {
    var user = firebase.auth().currentUser;
    firebase
      .database()
      .ref("contract/")
      .set({});
  }
  returnUID() {
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        let user = firebase.auth().currentUser;
        firebase
          .database()
          .ref("profiles/" + user.uid)
          .on("value", (data: any) => {
            let details = data.val();
            var keys = Object.keys(details);
            this.returnCurrentUser.push(details);
            accpt(this.returnCurrentUser);
          });
      });
    });
  }

  BuyPicture(artkey, userkey, message, picKey) {
    console.log(picKey);
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        let dateObj = new Date();
        let currentUser = firebase.auth().currentUser.uid;
        let time = dateObj
          .toTimeString()
          .replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
        var resuls;

        // firebase
        // .database()
        // .ref("messages/" + artkey)
        // .child(userkey)
        // .push({
        //   message: message,
        //   uid: currentUser,
        //   time: time,
        //   status: resuls,
        //   artKey: picKey
        // });

        resuls = false;
        firebase
          .database()
          .ref("messages/" + userkey + "/" + artkey + "/" + picKey)
          .push({
            message: message,
            uid: currentUser,
            time: time,
            status: resuls,
            artKey: picKey
          });
      });
    });
  }

  getOrders() {
    let loader = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Loading...",
      duration: 4000000000000000000
    });
    loader.present();
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        this.retriveCustomerDetails.length = 0;
        let currentUser = firebase.auth().currentUser.uid;
        let currentUserId = firebase.auth().currentUser.uid;
        firebase
          .database()
          .ref("Orders/" + currentUserId)
          .on("value", (data: any) => {
            let infor = data.val();
            if (data.val() != null || data.val() != undefined) {
              this.retriveCustomerDetails.length = 0;
              let keys = Object.keys(infor);
              firebase
                .database()
                .ref("Orders/" + currentUserId)
                .on("value", (data2: any) => {
                  let inforKey = data2.val();
                  let keys2 = Object.keys(inforKey);
                  for (var i = 0; i < keys.length; i++) {
                    var k = keys2[i];
                    let obj = {
                      tempName: inforKey[k].tempName,
                      tempdownloadurl: inforKey[k].tempdownloadurl,
                      name1: inforKey[k].name1,
                      price: infor[k].price,
                      email: infor[k].email,
                      downloadurl: inforKey[k].downloadurl,
                      message: inforKey[k].message,
                      messageRead: infor[k].messageRead,
                      currentUserId: infor[k].currentUserId,
                      uid: infor[k].uid,
                      key: k
                    };
                    this.retriveCustomerDetails.push(obj);
                  }
                });
              loader.dismiss();
              accpt(this.retriveCustomerDetails);
            }
          });
      });
    });
  }

  retrieveChats(artkey, userkey, message, picKey) {
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        let currentUser = firebase.auth().currentUser.uid;
        firebase
          .database()
          .ref("messages/" + currentUser)
          .on("value", data => {
            let infor1 = data.val();
            if (data.val() != null || data.val() != undefined) {
              this.arrMssg.length = 0;
              let keys = Object.keys(infor1);
            }
            firebase
              .database()
              .ref("messages/" + userkey)
              .child(artkey)
              .on("value", data2 => {
                this.arrMssg.length = 0;
                console.log("get chats");
                let infor2 = data2.val();
                if (data2.val() != null || data2.val() != undefined) {
                  this.arrMssg.length = 0;
                  let keys2 = Object.keys(infor2);
                  console.log(picKey);
                  for (var i = 0; i < keys2.length; i++) {
                    let k = keys2[i];
                    console.log(infor2[k].artKey);
                    if (infor2[k].artKey == picKey) {
                      let obj = {
                        message: infor2[k].message,
                        time: infor2[k].time,
                        uid: infor2[k].uid
                      };
                      this.arrMssg.push(obj);
                    }
                  }
                }
                firebase
                  .database()
                  .ref("messages/" + artkey)
                  .child(userkey)
                  .on("value", data3 => {
                    this.arrMssg.length = 0;
                    let infor3 = data3.val();
                    if (data3.val() != null || data3.val() != undefined) {
                      this.arrMssg.length = 0;
                      let keys3 = Object.keys(infor3);
                      for (var i = 0; i < keys3.length; i++) {
                        let k = keys3[i];
                        if (infor3[k].artKey == picKey) {
                          let obj = {
                            message: infor3[k].message,
                            time: infor3[k].time,
                            uid: infor3[k].uid
                          };
                          this.arrMssg.push(obj);
                        }
                      }
                    }
                  });
              });
            accpt(this.arrMssg);
          });
      });
    });
  }

  getUserEmail() {
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
        firebase.auth().onAuthStateChanged(user => {
          if (user != null) {
            resolve(user.email);
          }
        });
      });
    });
  }

  getMessages(artkey, userkey) {
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        firebase
          .database()
          .ref("messages/" + artkey)
          .child(userkey)
          .on("value", data3 => {
            // this.arrMssg.length = 0;
            let infor3 = data3.val();
            if (data3.val() != null || data3.val() != undefined) {
              // this.arrMssg.length =0;
              let keys3 = Object.keys(infor3);
              let obj = {};
              for (var i = 0; i < keys3.length; i++) {
                let k = keys3[i];
                obj = {
                  message: infor3[k].message,
                  time: infor3[k].time,
                  uid: infor3[k].uid,
                  status: infor3[k].status
                };
              }
              accpt(obj);
            }
          });
      });
    });
  }
  usersIds = [];
  checkOrder(userid, url) {
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        firebase
          .database()
          .ref("Orders/" + userid)
          .on("value", (data: any) => {
            let currentUser = firebase.auth().currentUser.uid;
            let results;
            if (data.val() != null || data.val() != undefined) {
              let Orders = data.val();
              let keys = Object.keys(Orders);
              for (var x = 0; x < keys.length; x++) {
                firebase
                  .database()
                  .ref("Orders/" + userid + "/" + keys[x])
                  .on("value", (data2: any) => {
                    this.usersIds.push(data2.val());
                  });
              }
              for (var i = 0; i < this.usersIds.length; i++) {
                if (
                  this.usersIds[i].currentUserId == currentUser &&
                  url == this.usersIds[i].downloadurl
                ) {
                  results = "found";
                  accpt(results);
                  break;
                } else {
                  results = "not found";
                }
              }
              accpt(results);
            } else {
              accpt("not found");
            }
          });
      });
    });
  }
  display() {
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        let currentUserId = firebase.auth().currentUser.uid;
        firebase
          .database()
          .ref("Orders/" + currentUserId)
          .on("value", (data: any) => {
            let infor = data.val();
            if (data.val() != null || data.val() != undefined) {
              this.retriveCustomerDetails.length = 0;
              let keys = Object.keys(infor);
              firebase
                .database()
                .ref("Orders/" + currentUserId)
                .on("value", (data2: any) => {
                  let inforKey = data2.val();
                  let keys2 = Object.keys(inforKey);
                  for (var i = 0; i < keys.length; i++) {
                    var k = keys2[i];
                    let obj = {
                      tempName: inforKey[k].tempName,
                      tempdownloadurl: inforKey[k].tempdownloadurl,
                      name1: inforKey[k].name1,
                      price: infor[k].price,
                      email: infor[k].email,
                      downloadurl: inforKey[k].downloadurl,
                      message: inforKey[k].message,
                      messageRead: infor[k].messageRead,
                      currentUserId: infor[k].currentUserId,
                      uid: infor[k].uid,
                      key: k
                    };
                    this.retriveCustomerDetails.push(obj);
                  }
                });
            }
          });
        accpt(this.retriveCustomerDetails);
      });
    });
  }

  sendMessage(path, message, art) {
    console.log(art);
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        let dateObj = new Date();
        let currentUser = firebase.auth().currentUser.uid;
        let time = moment().format("MMMM Do YYYY, h:mm:ss a");
        var resuls = "false";
        firebase
          .database()
          .ref(path)
          .push({
            message: message,
            uid: currentUser,
            time: time,
            status: resuls,
            artKey: art
          });
        accpt("sent");
      });
    });
  }

  allMessages = new Array();
  retrieveAllChats(path) {
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        this.allMessages = [];
        let currentUser = firebase.auth().currentUser.uid;
        firebase
          .database()
          .ref(path)
          .on("value", data => {
            this.allMessages.length = 0;
            if (data.val() != undefined || data.val() != null) {
              var messages = data.val();
              var keys = Object.keys(messages);
              for (var x = 0; x < keys.length; x++) {
                var k = keys[x];
                let obj = {
                  message: messages[k].message,
                  time: messages[k].time,
                  uid: messages[k].uid,
                  status: messages[k].status,
                  artKey: messages[k].artKey
                };
                this.allMessages.push(obj);
              }
              accpt(this.allMessages);
            }
          });
      });
    });
  }
  conversation = new Array();
  messgaes = new Array();

  getSentMessages() {
    return new Promise((pass, fail) => {
      var currentUser = firebase.auth().currentUser.uid;
      this.conversation.length = 0;
      this.allMessages.length = 0;
      firebase
        .database()
        .ref("messages2/" + currentUser)
        .on("value", data => {
          if (data.val() != undefined || data.val() != undefined) {
            var destinationIDs = data.val();
            var destKeys = Object.keys(destinationIDs);
            for (var x = 0; x < destKeys.length; x++) {
              firebase
                .database()
                .ref("messages2/" + currentUser + "/" + destKeys[x])
                .on("value", artKeys => {
                  if (artKeys.val() != undefined || artKeys.val() != null) {
                    var artskeyz = artKeys.val();
                    var artKeyzz = Object.keys(artskeyz);
                    for (var i = 0; i < artKeyzz.length; i++) {
                      firebase
                        .database()
                        .ref(
                          "messages2/" +
                            currentUser +
                            "/" +
                            destKeys[x] +
                            "/" +
                            artKeyzz[i]
                        )
                        .on("value", messages => {
                          if (messages.val() != undefined || messages.val()) {
                            var messg = messages.val();
                            var msgKeys = Object.keys(messg);
                            var artKey;
                            var lastMesag;
                            var time;
                            var destKey = destKeys[x];
                            var path =
                              "messages2/" +
                              currentUser +
                              "/" +
                              destKeys[x] +
                              "/" +
                              artKeyzz[i];
                            for (var y = 0; y < msgKeys.length; y++) {
                              artKey = messg[msgKeys[y]].artKey;
                              lastMesag = messg[msgKeys[y]].message;
                              time = messg[msgKeys[y]].time;
                            }
                            firebase
                              .database()
                              .ref("Orders/" + destKeys[x])
                              .on("value", orders => {
                                if (
                                  orders.val() != undefined ||
                                  orders.val() != null
                                ) {
                                  var allOrders = orders.val();
                                  var OrdersKey = Object.keys(allOrders);
                                  for (var z = 0; z < OrdersKey.length; z++) {
                                    var k = OrdersKey[z];
                                    var keyArt = allOrders[k].artKey;
                                    if (keyArt == artKey) {
                                      console.log(destKey);
                                      firebase
                                        .database()
                                        .ref("profiles/" + destKey)
                                        .on("value", profile => {
                                          console.log(profile.val());
                                          this.setConversation(
                                            profile.val().downloadurl,
                                            lastMesag,
                                            time,
                                            profile.val().name,
                                            path,
                                            destKey,
                                            allOrders[k].downloadurl,
                                            artKey
                                          );
                                        });
                                    }
                                  }
                                }
                              });
                          }
                        });
                      console.log("nothing found");
                      pass("");
                    }
                  }
                });
            }
          } else {
            console.log("nothing found");
            pass("");
            this.conversation.length = 0;
            this.allMessages.length = 0;
          }
        });
    });
  }

  checkOrderState(id, key) {
    return new Promise((accpt, rej) => {
      var currentUser = firebase.auth().currentUser.uid;
      firebase
        .database()
        .ref("Orders/" + currentUser)
        .on("value", data => {});
    });
  }

  tempMsgArray = new Array();
  getDirectMessgs() {
    return new Promise((pass, fail) => {
      var currentUser = firebase.auth().currentUser.uid;
      firebase
        .database()
        .ref("Orders/" + currentUser)
        .on("value", data => {
          if (data.val() != undefined || data.val() != null) {
            console.log("direct");
            this.tempMsgArray.length = 0;
            var orders = data.val();
            var keys = Object.keys(orders);
            var artKey;
            var lastMesag;
            var time;
            var path;
            for (var x = 0; x < keys.length; x++) {
              var k = keys[x];
              path =
                "messages2/" +
                orders[k].currentUserId +
                "/" +
                currentUser +
                "/" +
                orders[k].artKey;
              let Obj = {
                path: path,
                id: orders[k].currentUserId,
                url: orders[k].downloadurl
              };
              this.tempMsgArray.push(Obj);
            }
            this.step2(this.tempMsgArray).then(() => {
              pass("");
            });
          } else {
            pass("");
          }
        });
    });
  }

  step2Arr = new Array();
  step2(data) {
    return new Promise((pass, fail) => {
      console.log(data);
      for (var x = 0; x < data.length; x++) {
        console.log(data[x].path);
        firebase
          .database()
          .ref(data[x].path)
          .limitToLast(1)
          .on("value", data2 => {
            var details = data2.val();
            var keys = Object.keys(details);
            let obj = {
              artKey: details[keys[0]].artKey,
              time: details[keys[0]].time,
              lastMesag: details[keys[0]].message,
              id: details[keys[0]].uid
            };
            this.step2Arr.push(obj);
          });
      }
      setTimeout(() => {
        this.step3(data, this.step2Arr).then(() => {
          pass("");
        });
      }, 1000);
    });
  }

  step3Arr = new Array();
  step3(users, messgages) {
    return new Promise((pass, fail) => {
      for (var x = 0; x < messgages.length; x++) {
        firebase
          .database()
          .ref("profiles/" + users[x].id)
          .on("value", data2 => {
            let obj = {
              url: data2.val().downloadurl,
              name: data2.val().name
            };
            this.step3Arr.push(obj);
          });
      }
      console.log();

      this.combine(users, messgages, this.step3Arr).then(() => {
        pass("");
      });
    });
  }

  combine(users, mes, pro) {
    return new Promise((accpt, rej) => {
      setTimeout(() => {
        for (var x = 0; x < users.length; x++) {
          this.setConversation(
            pro[x].url,
            mes[x].lastMesag,
            mes[x].time,
            pro[x].name,
            users[x].path,
            users[x].id,
            users[x].url,
            mes[x].artKey
          );
        }
        accpt("");
      }, 700);
    });
  }

  // getProfiles(data) {
  //   return new Promise((accpt, rej) => {
  //     console.log(data.length);
  //     var temp = data;
  //     console.log(data[0]);
  //     var artKey = data[0].artKey
  //     var lastMesag = data[0].lastMesag
  //     var time = data[0].time
  //     var path = data[0].path;
  //     var url = data[0].url
  //     var id = data[0].id
  //     firebase.database().ref('profiles/' + data[0].id).on('value', profile => {
  //       console.log(lastMesag);
  //       this.setConversation(profile.val().downloadurl, lastMesag, time, profile.val().name, path, id, url, artKey)
  //     })
  //     accpt('')
  //   })
  // }
  setConversation(image, lastMessage, time, name, path, id, pic, key) {
    console.log(key);
    var currentUser = firebase.auth().currentUser.uid;
    let msgObj = {
      tempName: name,
      message: lastMessage,
      time: time,
      tempdownloadurl: image,
      path: path,
      ID: id,
      pic: pic,
      key: key,
      user: currentUser
    };
    this.conversation.push(msgObj);
    console.log("aassignnn");
    console.log(this.conversation);
  }

  getAllConvo() {
    return new Promise((accpt, rej) => {
      accpt(this.conversation);
    });

    // return new Promise((accpt, rej) =>{
    //   console.log('returning messages');
    //   console.log(this.conversation)
    // accpt (this.conversation);
    // })
  }
}
