import { Component } from '@angular/core';
import { Platform, NavController, NavParams, LoadingController } from 'ionic-angular';

import { MediaPlugin } from 'ionic-native';

import {CourseService} from '../../providers/course-service';
import {DatabaseService} from '../../providers/database-service';

import * as $ from "jquery";
/*
  Generated class for the PracticeListen page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-practice-listen',
  templateUrl: 'practice-listen.html',
  providers: [CourseService]
})
export class PracticeListenPage {
	courseId:any;
	listQuestions:any = [];

	currentIndex:number = 0;
	currentQuestion:any = {correctAnswer : {} , answerList : [] };

  listClasses:Array<any>;

  	constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,public platform: Platform,
  	public courseService: CourseService,public databaseService: DatabaseService) {
    		this.courseId = navParams.get('courseId');
        this.listClasses = [];

        let loading = this.loadingCtrl.create({
              content: 'Please wait...'
          });
        loading.present();

        this.databaseService.getAllWordsOfCourse(this.courseId)
        .then((data) => {
        		let listWords = [];

            listWords = this.courseService.shuffleArray(data);
            this.courseService.generateListenPractice(listWords, (result)=>{
                this.listQuestions = result;
                this.currentQuestion = this.listQuestions[this.currentIndex];
                setTimeout(()=>{
                    this.playAudio(this.currentQuestion.correctAnswer.audio);
                },600);
                loading.dismiss();
            });
             
        }, (err) => {
              console.error('Lỗi get lessons: ', err);
        });
  	}

  showChar(i) {
    	switch (i) {
        case 0: return 'A';
        case 1: return 'B';
        case 2: return 'C';
        case 3: return 'D';
      }
 	}

 	playAudio(audioUrl){
        let file = new MediaPlugin(audioUrl);
        console.log(audioUrl);
        file.init.then(() => {
            console.log('Playback Finished');
            file.release();
        }, (err) => {
          console.log(err)
          console.log('somthing went wrong! error code: ' + err.code + ' message: ' + err.message);
        });
        
  		  file.play();
  	}

 	selectAnswer(myAnswer){
   		let id = myAnswer.id;
      let audioUrl = '';
      this.listClasses = [];

      if (this.platform.is('android')) {
          audioUrl = '/android_asset/www/assets/audios/';
      }else{
          audioUrl = './assets/audios/';
      }
      
      if(id == this.currentQuestion.correctAnswer.id){
          this.listClasses[id] = 'checked-correct';
          audioUrl += 'answer_right.mp3';
          this.playAudio(audioUrl);

          setTimeout(()=>{
              this.nextQuestion();
          },500);
      }else{
          this.listClasses[id] = 'checked-wrong';
          audioUrl += 'answer_wrong.mp3';
          this.playAudio(audioUrl);
      }
      
      
 	}

   selectAns(ID){
       $("page-practice-listen .answer").removeClass("checked");

       $("page-practice-listen .answer-" + ID).addClass("checked");
   }

 	nextQuestion(){
   		if(this.currentIndex >= 0 && this.currentIndex < this.listQuestions.length){
   			  ++this.currentIndex;

   			    $("page-practice-listen ion-content").fadeOut(500 ,() => {
   				        this.currentQuestion = this.listQuestions[this.currentIndex];

                  $("page-practice-listen ion-content").fadeIn(500 ,() => {
                      setTimeout(()=>{
                          this.playAudio(this.currentQuestion.correctAnswer.audio);
                      },600);
                  });
              });
   		}
 	}

}
