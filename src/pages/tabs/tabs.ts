import { UploadPage } from './../upload/upload';
import { Component } from '@angular/core';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = HomePage;
  tab2Root: any = UploadPage;

  constructor() {
  }
}
