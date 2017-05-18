import { Component } from '@angular/core';
import {Platform, ViewController, NavController, NavParams, LoadingController, PopoverController, AlertController  } from 'ionic-angular';

import { MediaPlugin } from 'ionic-native';

import {CourseService} from '../../providers/course-service';
import {DatabaseService} from '../../providers/database-service';

import * as $ from "jquery";
/*
  Generated class for the PracticeWrite page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-practice-write',
  templateUrl: 'practice-write.html',
  providers: [CourseService]
})
export class PracticeWritePage {
  	count:number = 0;
  	listPosition:any = [];
    myListChar:any = [];
    
    courseId:any;
    listQuestions:any = [];

    currentIndex:number = 0;
    currentQuestion:any = {correctAnswer : {} , answerList : [] };

    myAnswer:string = '';

    isSuggest:string = 'Yes';
    inputAnswer:string = '';

  	constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,public alertCtrl: AlertController,public platform: Platform,
    public popoverCtrl: PopoverController, public courseService: CourseService,public databaseService: DatabaseService) {
        this.courseId = navParams.get('courseId');

        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();

        this.databaseService.getAllWordsOfCourse(this.courseId)
        .then((data) => {
              let listWords = [];
              listWords = this.courseService.shuffleArray(data);
              this.courseService.generateWritePractice(listWords, (result)=>{
                  this.listQuestions = result;
                  this.currentQuestion = this.listQuestions[this.currentIndex];

                  loading.dismiss();
              });
        }, (err) => {
          console.error('Lỗi get lessons: ', err);
        });
    }

    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create(Popover,{ isSuggest : this.isSuggest});
        popover.present({
            ev: myEvent
        });

        popover.onDidDismiss(data => {
            if(data){
                this.isSuggest = data;
                setTimeout(()=>{
                  for (let i = 0; i < this.listPosition.length; ++i) {
                    $("page-practice-write .quesstion .answer-" + this.listPosition[i]).addClass("clicked");
                  }
                },100);
            }
      });
    }

    playAudio(audioUrl){
        let file = new MediaPlugin(audioUrl);

        file.init.then(() => {
            console.log('Playback Finished');
            file.release();
        }, (err) => {
          console.log('somthing went wrong! error code: ' + err.code + ' message: ' + err.message);
        });
        
        file.play();
    }

  	select(ch, pos){
        this.myListChar.push(ch);
        this.myAnswer += ch;
        this.listPosition.push(pos);

        $("page-practice-write .quesstion .answer-" + pos).addClass("clicked");

        this.checkAnswer(this.myAnswer);
  	}

    checkAnswer(myAnswer){
        let flag = true;
        if(!myAnswer){
            myAnswer = this.inputAnswer.trim();
            flag = false;
        }  

        let audioUrl = '';
        if (this.platform.is('android')) {
            audioUrl = '/android_asset/www/assets/audios/';
        }else{
            audioUrl = './assets/audios/';
        }

        if(myAnswer == this.currentQuestion.correctAnswer.word){
            audioUrl += 'answer_right.mp3';
            this.playAudio(audioUrl);

            setTimeout(()=>{
                this.nextQuestion();
            },500);
        }else{
            if((flag && myAnswer.length == this.currentQuestion.correctAnswer.word.length) || !flag){
                audioUrl += 'answer_wrong.mp3';
                this.playAudio(audioUrl);
            }   
        }
    }

  	delete(){

      let char = this.myListChar[this.myListChar.length - 1];
      let pos = this.getLastElementOfArray(this.listPosition);

      $("page-practice-write .quesstion .answer-" + pos).html(char);
      $("page-practice-write .quesstion .answer-" + pos).removeClass("clicked");

      this.myListChar.pop();
      this.myAnswer = this.myAnswer.substring(0,this.myAnswer.length-1);
  	}

    deleteMultiChar(pos){
        let totalCharDelete = this.myListChar.length - pos;

        for (let i = 0; i < totalCharDelete; ++i) {
          this.delete();
        }
    }

    showInfo(){
        let alert = this.alertCtrl.create({
            title: this.currentQuestion.correctAnswer.word,
            // subTitle: this.currentQuestion.correctAnswer.mean,
            message: this.currentQuestion.correctAnswer.mean,
            cssClass : "alert-show-infor",
            buttons: ['OK']
        });
        alert.present();
    }

  	getLastElementOfArray(arr:any){
    		let pos = 0;
    		if(arr.length > 0){
    			pos = arr[arr.length - 1];
    			arr.pop();
    		}

    		return pos;
  	}

    nextQuestion(){
        this.reset();
        if(this.currentIndex >= 0 && this.currentIndex < this.listQuestions.length){
           ++this.currentIndex;

             $("page-practice-write ion-content").fadeOut(500 ,() => {
                   this.currentQuestion = this.listQuestions[this.currentIndex];

                  $("page-practice-write ion-content").fadeIn(500 ,() => {
                      
                  });
              });
       }
    }

    reset(){
        $("page-practice-write .quesstion button").removeClass("clicked");

        this.inputAnswer = '';
        this.myAnswer = '';
        this.listPosition = [];
        this.myListChar = [];
    }

    

}

@Component({
  selector: 'popover',
  template: `
    <ion-list radio-group  [(ngModel)]="mySelection" (ngModelChange)="doSomething($event)">
        <ion-list-header style="text-align: center;font-size: 20px;"> Gợi ý ? </ion-list-header>

        <ion-item>
            <ion-label>Có</ion-label>
            <ion-radio checked="true" value="Yes"></ion-radio>
        </ion-item>

        <ion-item>
            <ion-label>Không</ion-label>
            <ion-radio value="No"></ion-radio>
        </ion-item>
    </ion-list>
  `
})
export class Popover {
    mySelection:string = 'Yes';
    constructor(public viewCtrl: ViewController,public params : NavParams) {
        this.mySelection = this.params.get('isSuggest');
    }

    doSomething(e) {
        this.viewCtrl.dismiss(this.mySelection);
    }

}
