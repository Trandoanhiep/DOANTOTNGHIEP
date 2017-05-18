var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Platform, ViewController, NavController, NavParams, LoadingController, PopoverController, AlertController } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
import { CourseService } from '../../providers/course-service';
import { DatabaseService } from '../../providers/database-service';
import * as $ from "jquery";
/*
  Generated class for the PracticeWrite page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var PracticeWritePage = (function () {
    function PracticeWritePage(navCtrl, navParams, loadingCtrl, alertCtrl, platform, popoverCtrl, courseService, databaseService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.platform = platform;
        this.popoverCtrl = popoverCtrl;
        this.courseService = courseService;
        this.databaseService = databaseService;
        this.count = 0;
        this.listPosition = [];
        this.myListChar = [];
        this.listQuestions = [];
        this.currentIndex = 0;
        this.currentQuestion = { correctAnswer: {}, answerList: [] };
        this.myAnswer = '';
        this.isSuggest = 'Yes';
        this.inputAnswer = '';
        this.courseId = navParams.get('courseId');
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this.databaseService.getAllWordsOfCourse(this.courseId)
            .then(function (data) {
            var listWords = [];
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    var e = { id: 0, subject_id: 0, course_id: 0, word: '', phonetic: '',
                        mean: '', image: '', example: '', example_mean: '', audio: '' };
                    e = {
                        id: data.rows.item(i).id,
                        subject_id: data.rows.item(i).subject_id,
                        course_id: data.rows.item(i).course_id,
                        word: data.rows.item(i).word,
                        phonetic: data.rows.item(i).phonetic,
                        mean: data.rows.item(i).mean,
                        example: data.rows.item(i).example,
                        example_mean: data.rows.item(i).example_mean,
                        image: _this.courseService.getUrlImageWord(_this.courseId, data.rows.item(i).id),
                        audio: _this.courseService.getUrlAudioWord(_this.courseId, data.rows.item(i).id),
                    };
                    listWords.push(e);
                }
                listWords = _this.courseService.shuffleArray(listWords);
                _this.courseService.generateWritePractice(listWords, function (result) {
                    _this.listQuestions = result;
                    _this.currentQuestion = _this.listQuestions[_this.currentIndex];
                    loading.dismiss();
                });
            }
        }, function (err) {
            console.error('Lỗi get lessons: ', err);
        });
    }
    PracticeWritePage.prototype.presentPopover = function (myEvent) {
        var _this = this;
        var popover = this.popoverCtrl.create(Popover, { isSuggest: this.isSuggest });
        popover.present({
            ev: myEvent
        });
        popover.onDidDismiss(function (data) {
            if (data) {
                _this.isSuggest = data;
                setTimeout(function () {
                    for (var i = 0; i < _this.listPosition.length; ++i) {
                        $("page-practice-write .quesstion .answer-" + _this.listPosition[i]).addClass("clicked");
                    }
                }, 100);
            }
        });
    };
    PracticeWritePage.prototype.playAudio = function (audioUrl) {
        var file = new MediaPlugin(audioUrl);
        file.init.then(function () {
            console.log('Playback Finished');
            file.release();
        }, function (err) {
            console.log('somthing went wrong! error code: ' + err.code + ' message: ' + err.message);
        });
        file.play();
    };
    PracticeWritePage.prototype.select = function (ch, pos) {
        this.myListChar.push(ch);
        this.myAnswer += ch;
        this.listPosition.push(pos);
        $("page-practice-write .quesstion .answer-" + pos).addClass("clicked");
        this.checkAnswer(this.myAnswer);
    };
    PracticeWritePage.prototype.checkAnswer = function (myAnswer) {
        var _this = this;
        var flag = true;
        if (!myAnswer) {
            myAnswer = this.inputAnswer.trim();
            flag = false;
        }
        var audioUrl = '';
        if (this.platform.is('android')) {
            audioUrl = '/android_asset/www/assets/audios/';
        }
        else {
            audioUrl = './assets/audios/';
        }
        if (myAnswer == this.currentQuestion.correctAnswer.word) {
            audioUrl += 'answer_right.mp3';
            this.playAudio(audioUrl);
            setTimeout(function () {
                _this.nextQuestion();
            }, 500);
        }
        else {
            if ((flag && myAnswer.length == this.currentQuestion.correctAnswer.word.length) || !flag) {
                audioUrl += 'answer_wrong.mp3';
                this.playAudio(audioUrl);
            }
        }
    };
    PracticeWritePage.prototype.delete = function () {
        var char = this.myListChar[this.myListChar.length - 1];
        var pos = this.getLastElementOfArray(this.listPosition);
        $("page-practice-write .quesstion .answer-" + pos).html(char);
        $("page-practice-write .quesstion .answer-" + pos).removeClass("clicked");
        this.myListChar.pop();
        this.myAnswer = this.myAnswer.substring(0, this.myAnswer.length - 1);
    };
    PracticeWritePage.prototype.deleteMultiChar = function (pos) {
        var totalCharDelete = this.myListChar.length - pos;
        for (var i = 0; i < totalCharDelete; ++i) {
            this.delete();
        }
    };
    PracticeWritePage.prototype.showInfo = function () {
        var alert = this.alertCtrl.create({
            title: this.currentQuestion.correctAnswer.word,
            // subTitle: this.currentQuestion.correctAnswer.mean,
            message: this.currentQuestion.correctAnswer.mean,
            cssClass: "alert-show-infor",
            buttons: ['OK']
        });
        alert.present();
    };
    PracticeWritePage.prototype.getLastElementOfArray = function (arr) {
        var pos = 0;
        if (arr.length > 0) {
            pos = arr[arr.length - 1];
            arr.pop();
        }
        return pos;
    };
    PracticeWritePage.prototype.nextQuestion = function () {
        var _this = this;
        this.reset();
        if (this.currentIndex >= 0 && this.currentIndex < this.listQuestions.length) {
            ++this.currentIndex;
            $("page-practice-write ion-content").fadeOut(500, function () {
                _this.currentQuestion = _this.listQuestions[_this.currentIndex];
                $("page-practice-write ion-content").fadeIn(500, function () {
                });
            });
        }
    };
    PracticeWritePage.prototype.reset = function () {
        $("page-practice-write .quesstion button").removeClass("clicked");
        this.inputAnswer = '';
        this.myAnswer = '';
        this.listPosition = [];
        this.myListChar = [];
    };
    return PracticeWritePage;
}());
PracticeWritePage = __decorate([
    Component({
        selector: 'page-practice-write',
        templateUrl: 'practice-write.html',
        providers: [CourseService]
    }),
    __metadata("design:paramtypes", [NavController, NavParams, LoadingController, AlertController, Platform,
        PopoverController, CourseService, DatabaseService])
], PracticeWritePage);
export { PracticeWritePage };
var Popover = (function () {
    function Popover(viewCtrl, params) {
        this.viewCtrl = viewCtrl;
        this.params = params;
        this.mySelection = 'Yes';
        this.mySelection = this.params.get('isSuggest');
    }
    Popover.prototype.doSomething = function (e) {
        this.viewCtrl.dismiss(this.mySelection);
    };
    return Popover;
}());
Popover = __decorate([
    Component({
        selector: 'popover',
        template: "\n    <ion-list radio-group  [(ngModel)]=\"mySelection\" (ngModelChange)=\"doSomething($event)\">\n        <ion-list-header style=\"text-align: center;font-size: 20px;\"> G\u1EE3i \u00FD ? </ion-list-header>\n\n        <ion-item>\n            <ion-label>C\u00F3</ion-label>\n            <ion-radio checked=\"true\" value=\"Yes\"></ion-radio>\n        </ion-item>\n\n        <ion-item>\n            <ion-label>Kh\u00F4ng</ion-label>\n            <ion-radio value=\"No\"></ion-radio>\n        </ion-item>\n    </ion-list>\n  "
    }),
    __metadata("design:paramtypes", [ViewController, NavParams])
], Popover);
export { Popover };
//# sourceMappingURL=practice-write.js.map