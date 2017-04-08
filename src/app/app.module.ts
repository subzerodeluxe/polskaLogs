import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from "@angular/http";
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { PolskaLogs } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// import angularFire and firebase
import { AngularFireModule } from 'angularfire2';
import { LogService } from "../providers/log-service";
import { TabsPage } from "../pages/tabs/tabs";
import { UploadPage } from "../pages/upload/upload";
import { LogModalPage } from "../components/log-modal/log-modal";
import { LogListPage } from "../pages/log-list/log-list";
import { ImageService } from "../providers/image-service";

 const firebaseConfig =  { 
    apiKey: "AIzaSyDHFylpqNwwK-xOniXPjUDACxhldPXV0b4",
    authDomain: "polskalogs.firebaseapp.com",
    databaseURL: "https://polskalogs.firebaseio.com",
    projectId: "polskalogs",
    storageBucket: "polskalogs.appspot.com",
    messagingSenderId: "583533910136"
 };

@NgModule({
  declarations: [
    PolskaLogs,
    HomePage,
    ListPage,
    TabsPage,
    UploadPage,
    LogModalPage,
    LogListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(PolskaLogs),
    AngularFireModule.initializeApp(firebaseConfig),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    PolskaLogs,
    HomePage,
    ListPage,
    TabsPage,
    UploadPage,
    LogModalPage,
    LogListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LogService,
    ImageService
  
  ]
})
export class AppModule {}
