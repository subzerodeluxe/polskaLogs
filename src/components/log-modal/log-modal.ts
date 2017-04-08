import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ViewController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ImageService } from "../../providers/image-service";
import { LogService } from "../../providers/log-service";

@Component({
  selector: 'page-log-modal',
  templateUrl: 'log-modal.html'
})

export class LogModalPage {

   private loading: any; 

   public form: any;
   public logs: FirebaseListObservable<any[]>;
   public logName: any = '';
   public logSummary: any = '';
   public logTags: any = [];

   public logImage: any     = '';
   public logId: string  = '';
   public isEditable: boolean = false;


   constructor(public navCtrl: NavController, public params: NavParams,
      private formBuilder: FormBuilder, private loadingCtrl: LoadingController, private ngFire: AngularFire,
      public viewCtrl: ViewController, private logService: LogService, private imageService: ImageService)
   {
      this.form = formBuilder.group({
         'summary': ['', Validators.minLength(10)],
         'name': ['', Validators.required],
         'image': ['', Validators.required],
         'tags': ['', Validators.required]
      });

      this.logs = this.ngFire.database.list('/logs');


      if(params.get('isEdited')) {
          let log 		= params.get('log'), k;

          this.logName = log.title;
          this.logSummary = log.summary;
          this.logImage = log.image; 
          this.logId = log.id;

          for(k in log.tags){
             this.logTags.push(log.tags[k].name);
          }

          this.isEditable = true;
      }
   }

   saveLog(val) {

     this.displayPreloader(); 

      let title     : string	= this.form.controls["name"].value,
          summary   : string 	= this.form.controls["summary"].value,
          image     : string	= this.form.controls["image"].value,
          tags      : any       = this.form.controls["tags"].value,
          types     : any       = [],
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
	              image    : uploadedImage,
	              tags     : types
	           })
               .then((data) => {
                  this.hidePreloader();
               });

            });
         } else {

           this.logService.updateDatabase(this.logId,{
	          title    : title,
	          summary  : summary,
	          tags   : types
	       })
           .then((data) => {
              this.hidePreloader();
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
	           tags     : types
	           
	        })
            .then((data) => {
               this.hidePreloader();
            });
         });

      }
      this.closeModal(true);
  }

  closeModal(val = null){
      this.viewCtrl.dismiss(val);
   }


   selectImage(){
      this.imageService.selectImage()
      .then((data) => {
         this.logImage = data;
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