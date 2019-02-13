import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SendEmailProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SendEmailProvider {

  constructor(public http: HttpClient) {
    console.log('Hello SendEmailProvider Provider');
  }

  sendEmail(sender, receiver, img, price){
    var message = "hello there, this email serves to show that " + sender + "intrested in Art(click the link to view)" + img + "the art costs R" + price;
    var subject = "Someone is intrested in your work";   
    console.log(receiver);
    this.http.get("https://api.elasticemail.com/v2/email/send?apikey=5de25685-7097-49c5-9b33-b27d1346b379&subject=" + subject + "&from=deriksadiki@gmail.com&msgTo="+ sender + "," + receiver + "&bodyText="+ message).subscribe( res =>{
  console.log(res)
});
  }
}
