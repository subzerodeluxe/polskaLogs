import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ViewController, NavParams, AlertController, ActionSheetController, ToastController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ImageService } from "../../providers/image-service";
import { LogService } from "../../providers/log-service";
import { LogListPage } from "../../pages/log-list/log-list";
import { Camera } from 'ionic-native';


@Component({
  selector: 'page-log-modal',
  templateUrl: 'log-modal.html'
})

export class LogModalPage {
  logPage = LogListPage; 

   public form: any;
   public logs: FirebaseListObservable<any[]>;
   public logName: any = '';
   public logDate = this.formatDate(new Date());  
   public logSummary: any = '';
   public logTags: any = [];

   public logImage: any = '';
   public logId: string  = '';
   public isEditable: boolean = false;


   constructor(public navCtrl: NavController, public params: NavParams,
      private formBuilder: FormBuilder, private ngFire: AngularFire,
      public viewCtrl: ViewController, 
      private alertCtrl: AlertController, 
      private toastCtrl: ToastController, 
      private actionSheetCtrl: ActionSheetController,
      private logService: LogService, private imageService: ImageService) {
      this.form = formBuilder.group({
         'summary': ['', Validators.minLength(10)],
         'name': ['', Validators.required],
         'image': ['', Validators.required],
         'date': ['', Validators.required],
         'tags': ['', Validators.required]
      });

      this.logs = this.ngFire.database.list('/logs');


      if(params.get('isEdited')) {
          let log 		= params.get('log');
    
          this.logName = log.title;
          this.logSummary = log.summary;
          this.logImage = log.image; 
          this.logDate = log.date; 
          this.logId = log.$key; 
          console.log("Het logId wordt gezet? " + this.logId);

          for(let k in log.tags){
             this.logTags.push(log.tags[k].name);
          }

          this.isEditable = true;
      }
   }

   saveLog(val) {
      let title     : string	= this.form.controls["name"].value,
          summary   : string 	= this.form.controls["summary"].value,
          image     : string	= this.form.controls["image"].value,
          tags      : any     = this.form.controls["tags"].value,
          date      : any     = this.form.controls["date"].value, 
          types     : any     = [],
  	      k         : any;

          for(k in tags) {
            types.push({
              "name" : tags[k]
          });
        }

     if(this.isEditable) {

         if(image !== this.logImage){
            this.logService.uploadImage(image)
              .then((snapshot: any) => {
               let uploadedImage: any = snapshot.downloadURL;

               this.logService.updateDatabase(this.logId, {
	              title    : title,
	              summary  : summary,
                date     : date, 
	              image    : uploadedImage,
	              tags     : types
	           })
               .then((data) => {
                  
               });

            });
         } else {

           this.logService.updateDatabase(this.logId,{
	          title    : title,
	          summary  : summary,
            date     : date, 
	          tags   : types
	       })
           .then((data) => {
             this.showMessage("Log is succesvol geupdated")
           });
	     }

      } else {
         this.logService.uploadImage(image)
          .then((snapshot : any) => {
            let uploadedImage : any = snapshot.downloadURL;

            this.logService.addToDatabase({
	           title    : title,
	           image    : uploadedImage,
	           summary  : summary,
             date     : date, 
	           tags     : types
	           
	        })
            .then((data) => {
              this.showMessage("Nieuw logbestand aangemaakt")
            });
         });

      }
      this.closeModal(true);
  }

  deleteLog() {
    console.log("What is log? " + this.logId); 
    if(this.isEditable) {
      
      this.logService.deleteLog(this.logId)
      .then((data) => {
        this.navCtrl.setRoot(this.logPage)
      }); 
    }
  }
 
  closeModal(val = null) {
      this.viewCtrl.dismiss(val);
   }


   selectImage() {
      this.presentActionSheet();
   }

  showMessage(message) {
      let alert = this.alertCtrl.create({
        title: 'Gelukt!',
        message: message,
        buttons: ['OK']
      });
      alert.present(); 
    }

  // Show the Action Sheet for library or camera selection
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select an image source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            //this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
            this.imageService.selectImage(Camera.PictureSourceType.PHOTOLIBRARY)
             .then((data) => {
                this.logImage = data;
                this.presentToast("Upload Finished");
              });
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.imageService.selectImage(Camera.PictureSourceType.CAMERA)
             .then((data) => {
              this.logImage = data;
              this.presentToast("Upload Finished");
            });
            //this.takePicture(Camera.PictureSourceType.CAMERA);
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

    // Display a toast message at the top
    presentToast(text) {
      let toast = this.toastCtrl.create({
        message: text,
        duration: 3000,
        position: 'top'
      });
      toast.present();
  }

  formatDate(date) {
    
    var monthNames = [
    "Januari", "Februari", "Maart",
    "April", "Mei", "Juni", "Juli",
    "Augustus", "September", "Oktober",
    "November", "December"
    ];

    var dayNames = [
      "Zondag", "Maandag", "Dinsdag", "Woensdag",
      "Donderdag", "Vrijdag", "Zaterdag", 
    ];

    var day = date.getDate();
    var dayIndex = date.getDay(); 
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return dayNames[dayIndex] + ' ' + day + ' ' + monthNames[monthIndex] + ' ' + year;
  } // formatDate() 
}