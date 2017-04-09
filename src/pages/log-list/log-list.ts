import { Component } from '@angular/core';
import { NavController, ModalController, Platform } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';

// import pages and services and models 
import { LogService } from "../../providers/log-service";
import { LogModalPage } from "../../components/log-modal/log-modal";


@Component({
  selector: 'page-log-list',
  templateUrl: 'log-list.html'
})
export class LogListPage {

  // Properties
  imageUrl = '';
  logs: any; 
  

  constructor(public navCtrl: NavController, private logService: LogService,
  private angFire: AngularFire, private modalCtrl: ModalController, private platform  : Platform) {}

  ionViewDidLoad() {

      
      this.platform.ready()
      .then(() => {
          this.loadAndParseLogs();
      });
   }


   loadAndParseLogs() {
      this.logs = this.logService.renderLogs(); 
      
   }

  addRecord() {
      let modal = this.modalCtrl.create(LogModalPage);
      modal.onDidDismiss((data) => {
         if(data) {
           
            this.loadAndParseLogs();
         }
      });
      modal.present();
   }

  showLog(log) {  // geef log mee aan modal 
        console.log("Dit komt binnnen (edit): " + JSON.stringify(log));
      let params = { log: log, isEdited: true },
          modal  = this.modalCtrl.create(LogModalPage, params);

      modal.onDidDismiss((data) => {
         if(data) {
            
            this.loadAndParseLogs();
         }
      });
      modal.present();
   }
}