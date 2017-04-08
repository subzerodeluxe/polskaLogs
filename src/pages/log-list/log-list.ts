import { Component } from '@angular/core';
import { NavController, ModalController, Platform, LoadingController } from 'ionic-angular';
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
  private loading : any;

  constructor(public navCtrl: NavController, private logService: LogService,
  private angFire: AngularFire, public loadingCtrl: LoadingController, private modalCtrl: ModalController, private platform  : Platform) {}

  ionViewDidLoad() {

      this.displayPreloader();
      this.platform.ready()
      .then(() => {
          this.loadAndParseLogs();
      });
   }


   loadAndParseLogs()
   {
      this.logs = this.logService.renderLogs(); 
      this.hidePreloader();
   }

  addRecord(){
      let modal = this.modalCtrl.create(LogModalPage);
      modal.onDidDismiss((data) => {
         if(data) {
            this.displayPreloader();
            this.loadAndParseLogs();
         }
      });
      modal.present();
   }

  editLog(log) {  // geef log mee aan modal 
      let params = { log: log, isEdited: true },
          modal  = this.modalCtrl.create(LogModalPage, params);

      modal.onDidDismiss((data) => {
         if(data) {
            this.displayPreloader();
            this.loadAndParseLogs();
         }
      });
      modal.present();
   }

   deleteLog(log: any) {
       console.log("Dit komt binnnen: " + JSON.stringify(log.name));
      this.displayPreloader();

      this.logService.deleteLog(log.id)
      .then((data) => {
         this.loadAndParseLogs();
      });
   }

   displayPreloader() {
        this.loading = this.loadingCtrl.create({
         content: 'Please wait...'
      });

      this.loading.present();
   }

   hidePreloader() {
     this.loading.dismiss();
   }

}