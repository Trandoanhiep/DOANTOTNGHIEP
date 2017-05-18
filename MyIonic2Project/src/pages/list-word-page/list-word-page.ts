import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { MediaPlugin } from 'ionic-native';

//modal
import { DetailWordModal } from '../modal-detail-word/modal-detail-word';

//page
import { PracticePage } from '../practice/practice';

//service
import {CourseService} from '../../providers/course-service';
import {DatabaseService} from '../../providers/database-service';

//Classes
import {Course}          from '../../classes/Course';
import {Lesson}          from '../../classes/Lesson';
import {Word}          from '../../classes/Word';

@Component({
  selector: 'page-list-word-page',
  templateUrl: 'list-word-page.html',
  providers: [CourseService]
})
export class ListWordPagePage {
	  lesson:Lesson;
    course:Course;

    listWords:Array<Word> = [];

	  file:MediaPlugin;

  	constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController,
    public courseService: CourseService, public databaseService: DatabaseService) {
        this.lesson = navParams.get('lesson');
    		this.course = navParams.get('course');

              this.databaseService.getAllWords(this.lesson.id, this.course.id)
              .then((data) => {
                  this.listWords = data;
              }, (err) => {
                  console.error('Lỗi get words: ', err);
              });
  	}

  	playAudio(event, audioUrrl){
        event.stopPropagation();

        this.file = new MediaPlugin(audioUrrl);

        this.file.init.then(() => {
            console.log('Playback Finished');
            this.file.release();
        }, (err) => {
          console.log('somthing went wrong! error code: ' + err.code + ' message: ' + err.message);
        });
        
  		  this.file.play();
  	}

    stopAudio(){
      this.file.stop();
    }

  	showDetailWord(word){
        let profileModal = this.modalCtrl.create(DetailWordModal, { word: word });
        profileModal.present();
  	}

    goToPractice(){
        this.navCtrl.push(PracticePage ,{params : "lesson" });
    }
}
