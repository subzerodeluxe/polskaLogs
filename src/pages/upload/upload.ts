import { ImageProvider } from './../../providers/image-provider';
import { Component } from '@angular/core';
import { NavController, ActionSheetController, ToastController, LoadingController, Loading } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { LogService } from "../../providers/log-service";

// ionic plugin add cordova-plugin-camera --save

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html'
})
export class UploadPage {
  currentImage: String = null;
  imageData: String = null;
  loader: Loading;

  constructor(public navCtrl: NavController, 
  public actionSheetCtrl: ActionSheetController, 
  public toastCtrl: ToastController, 
  public firebaseService: LogService, 
  public loadingCtrl: LoadingController) { }

  // Show the Action Sheet for library or camera selection
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: Camera.DestinationType.DATA_URL
    };

    Camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imageData = imageData;
      this.currentImage = base64Image;
    }, (err) => {
      this.presentToast("Error while selecting image");
    });

  }

  // Display a toast message at the top
  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Store an image into our Firebase Storage
  uploadImage() {
    this.loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    this.loader.present();
    this.firebaseService.uploadImage(this.imageData).then(succ => {
      this.loader.dismiss();
      this.presentToast("Upload Finished");
    });
  }

}
