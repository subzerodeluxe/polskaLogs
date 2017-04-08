import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import { FirebaseApp, AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from "rxjs/Observable";
import { Http } from "@angular/http";


@Injectable()
export class LogService {

   constructor(http: Http){ }

   renderLogs(): Observable<any> {
       try {
          return new Observable(observer => {
            let logs: any = [];
            firebase.database().ref('logs').orderByKey()
              .once('value', (items : any) => {
               items.forEach((item) => {
                  logs.push(item.val());
               });

               observer.next(logs);
               observer.complete();
            },
            (error) =>
            {
              console.log("Observer error: ", error);
              console.dir(error);
              observer.error(error)
            });

         });
      }
      catch(error)
      {
         console.log('Oh damn!');
         console.dir(error);
      }
   }

   deleteLog(id): Promise<any> {
      return new Promise((resolve) => {
         let ref = firebase.database().ref('logs').child(id);
         ref.remove();
         resolve(true);
      });
   }

   addToDatabase(logObj) : Promise<any> {
      return new Promise((resolve) => {
         let addRef = firebase.database().ref('logs');
         addRef.push(logObj);
         resolve(true);
      });
   }

   updateDatabase(id, logObj) : Promise<any> {
      return new Promise((resolve) => {
         var updateRef = firebase.database().ref('logs').child(id);
	        updateRef.update(logObj);
         resolve(true);
      });
   }

   uploadImage(imageString) : Promise<any> {
      let image       : string  = 'log-' + new Date().getTime() + '.jpg',
          storageRef  : any,
          parseUpload : any;

      return new Promise((resolve, reject) => {
         storageRef = firebase.storage().ref('uploads/' + image);
         parseUpload = storageRef.putString(imageString, 'data_url');

         parseUpload.on('state_changed', (_snapshot) => {
            // We could log the progress here IF necessary
            // console.log('snapshot progess ' + _snapshot);
         },
         (_err) =>
         {
            reject(_err);
         }, (success) => {
            resolve(parseUpload.snapshot);
         });
      });
   }
}

