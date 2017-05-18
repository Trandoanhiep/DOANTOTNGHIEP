import { Component, NgZone} from '@angular/core';
import { Platform,NavController, NavParams, LoadingController } from 'ionic-angular';

import { MediaPlugin } from 'ionic-native';

import {CourseService} from '../../providers/course-service';
import {DatabaseService} from '../../providers/database-service';

declare var SpeechRecognition: any;
import * as $ from "jquery";

@Component({
  selector: 'page-practice-speak',
  templateUrl: 'practice-speak.html',
  providers: [CourseService]
})
export class PracticeSpeakPage {
  	isSpeaking:boolean = false;

  	recognition:any;

  	text:string = '';

    courseId:string = '';
    currentIndex:number = 0;

    listQuestions:any = [];
    currentQuestion:any = {word : '', phonetic: '', audio: ''};

  	constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, public zone: NgZone,public loadingCtrl: LoadingController,
    public courseService: CourseService,public databaseService: DatabaseService  ) {
    		this.speechToText();

        this.courseId = navParams.get('courseId');

        let loading = this.loadingCtrl.create({
              content: 'Please wait...'
          });
        loading.present();

        this.databaseService.getAllWordsOfCourse(this.courseId)
        .then((data) => {
              this.listQuestions = this.courseService.shuffleArray(data);
              this.currentQuestion = this.listQuestions[this.currentIndex];
              loading.dismiss();

        }, (err) => {
          console.error('Lỗi get lessons: ', err);
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

  	speak(){
  		this.isSpeaking = !this.isSpeaking;

  		this.recognition.start();
  	}

  	speechToText(){
  		this.platform.ready().then(() => {
            this.recognition = new SpeechRecognition(); 
            this.recognition.lang = 'en-US';

            this.recognition.onnomatch = (event => {
                console.log('No match found.');
            });

            this.recognition.onerror = (event => {
                console.log('Error happens.');
                this.isSpeaking = false; 
                this.zone.run(() => {})  
            });

            this.recognition.onresult = (event => {
                if (event.results.length > 0) {
                    console.log('Output STT: ', event.results[0][0].transcript);  
                    this.text = event.results[0][0].transcript.toLowerCase(); 

                    this.isSpeaking = false;  
                    this.zone.run(() => {}) ;  

                    let quality = this.courseService.getSimilarityOfString(this.text,this.currentQuestion.word);  
                    console.log("bạn nói đúng : " + quality);
                }
            }); 

            this.recognition.onend = (event => {
                console.log('ended');
            });
        });
  	}

    nextQuestion(){
       if(this.currentIndex >= 0 && this.currentIndex < this.listQuestions.length){
           ++this.currentIndex;

             $("page-practice-speak ion-content").fadeOut(500 ,() => {
                   this.currentQuestion = this.listQuestions[this.currentIndex];

                  $("page-practice-speak ion-content").fadeIn(500 ,() => {
                      
                  });
              });
       }
   }

}
