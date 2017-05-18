import { Component , Input } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'part1',
  templateUrl: 'part1.html',
})
export class CoursesPage {
    @Input() PART1:any;

  	constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams) {//,public downloadService: DownloadService

    	    
  	}

    finishPart(){
      
    }

}
