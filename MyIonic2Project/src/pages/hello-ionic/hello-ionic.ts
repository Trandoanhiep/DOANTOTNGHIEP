import { Component } from '@angular/core';

import { NavController, LoadingController, NavParams, ModalController} from 'ionic-angular';

import { Camera } from 'ionic-native';

//page
import { ListWordPagePage } from '../list-word-page/list-word-page';
import { PracticePage } from '../practice/practice';

//service 
import {CourseService} from '../../providers/course-service';
import {VariableService} from '../../providers/variable-service';
import {DatabaseService} from '../../providers/database-service';

//Classes
import {Course}          from '../../classes/Course';
import {Lesson}          from '../../classes/Lesson';


@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html',
  providers: [CourseService, VariableService]
})

export class HelloIonicPage {
  	course:Course;
  	listLessons:Array<Lesson> = [];
  	urlImg:string = "";

 	constructor(public navCtrl: NavController,public loadingCtrl: LoadingController,public navParams: NavParams,public modalCtrl: ModalController,
 	public courseService: CourseService, public databaseService: DatabaseService,public globalVariable: VariableService) {
 		this.course = navParams.get('course');

		this.databaseService.getAllLessons(this.course.id)
		.then((data) => {
	        this.listLessons = data;
      	}, (err) => {
        	console.error('Lỗi get lessons: ', err);
      	});
  	}

  	selectLesson(lesson){
  		this.navCtrl.push(ListWordPagePage,{lesson : lesson, course : this.course });
  	}


	goToPractice(){
        this.navCtrl.push(PracticePage ,{ courseId : this.course.id });
    }

	// takePicture() {
	// 	var options = {
	//         quality: 50,
	//         destinationType: Camera.DestinationType.FILE_URI,
	//         encodingType: Camera.EncodingType.JPEG,
	//         mediaType: Camera.MediaType.PICTURE,
	//         allowEdit: true,
	//         correctOrientation: true  //Corrects Android orientation quirks
	//     }
 //  		Camera.getPicture(options).then((imageData) => {
	// 	 	// imageData is either a base64 encoded string or a file URI
	// 	 	// If it's base64:

	// 		// this.urlImg = 'data:image/jpeg;base64,' + imageData;
	// 		this.urlImg =  imageData;
	// 	}, (err) => {
	// 	 	// Handle error
	// 	});
 //  	}

}

