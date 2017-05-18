import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MediaPlugin } from 'ionic-native';

import {CourseService} from '../../providers/course-service';
import {DatabaseService} from '../../providers/database-service';

import * as $ from "jquery";
/*
  Generated class for the PracticeFlashcard page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-practice-flashcard',
  templateUrl: 'practice-flashcard.html',
  providers: [CourseService]
})
export class PracticeFlashcardPage {
    courseId:any;
    listFlashcards:any = [];

    currentIndex:number = 0;
    currentFlashcard:any = { id : '', front : {}, back : {} };


  	constructor(public navCtrl: NavController, public navParams: NavParams,
    public courseService: CourseService,public databaseService: DatabaseService) {
        this.courseId = navParams.get('courseId');

        this.databaseService.getAllWordsOfCourse(this.courseId)
        .then((data) => {
            let listWords = [];
            listWords = this.courseService.shuffleArray(data);
            this.listFlashcards = this.courseService.generateFlashcardPractice(listWords);
            this.listFlashcards = this.listFlashcards.splice(0,10);
            this.currentFlashcard = this.listFlashcards[this.currentIndex];
              
        }, (err) => {
          console.error('Lỗi get lessons: ', err);
        });
    }

  	flip(id){
  		$(".card-" + id).toggleClass("flipped");
  	}

  	playAudio(event, audioUrrl){
        event.stopPropagation();

        let file = new MediaPlugin(audioUrrl);

        file.init.then(() => {
            file.release();
        }, (err) => {
          console.log('somthing went wrong! error code: ' + err.code + ' message: ' + err.message);
        });
        
        file.play();
    }
}
