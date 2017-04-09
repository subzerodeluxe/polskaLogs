import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Camera } from 'ionic-native';


@Injectable()
export class ImageService {

  public cameraImage : String

   constructor(public http: Http) { }

   selectImage(sourceType): Promise<any> {
      return new Promise(resolve => {
         let cameraOptions = {
             sourceType         : sourceType, 
             destinationType    : Camera.DestinationType.DATA_URL,
             quality            : 100,
             targetWidth        : 320,
             targetHeight       : 240,
             encodingType       : Camera.EncodingType.JPEG,
             correctOrientation : true
         };

         Camera.getPicture(cameraOptions)
         .then((data) => {
            this.cameraImage 	= "data:image/jpeg;base64," + data;
            resolve(this.cameraImage);
         });

      });
   }
}
