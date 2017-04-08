import { Component } from '@angular/core';

import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LogService } from "../../providers/log-service";



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  images: any; 
  loading: any; 

  constructor(public navCtrl: NavController, 
  public logService: LogService, public loadingCtrl: LoadingController,
  public alertCtrl: AlertController) {
 
  }

  /*ngOnInit() {
    this.loadImages(); 
  }

  /*loadImages() {
    this.images = this.logService.getImages(); 
  }*/ 

  /*deleteImage(image) {
    this.logService.deleteImage(image.id)
      .then((data) => {
         this.loadImages(); 
    });
  }*/ 
}