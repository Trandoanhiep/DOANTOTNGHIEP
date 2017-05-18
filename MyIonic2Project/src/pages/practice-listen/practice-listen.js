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
import { Platform, NavController, NavParams, LoadingController } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
import { CourseService } from '../../providers/course-service';
import { DatabaseService } from '../../providers/database-service';
import * as $ from "jquery";
/*
  Generated class for the PracticeListen page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var PracticeListenPage = (function () {
    function PracticeListenPage(navCtrl, navParams, loadingCtrl, platform, courseService, databaseService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.platform = platform;
        this.courseService = courseService;
        this.databaseService = databaseService;
        this.listQuestions = [];
        this.currentIndex = 0;
        this.currentQuestion = { correctAnswer: {}, answerList: [] };
        this.courseId = navParams.get('courseId');
        this.listClasses = [];
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
                _this.courseService.generateListenPractice(listWords, function (result) {
                    _this.listQuestions = result;
                    _this.currentQuestion = _this.listQuestions[_this.currentIndex];
                    setTimeout(function () {
                        _this.playAudio(_this.currentQuestion.correctAnswer.audio);
                    }, 600);
                    loading.dismiss();
                });
            }
        }, function (err) {
            console.error('Lỗi get lessons: ', err);
        });
    }
    PracticeListenPage.prototype.showChar = function (i) {
        switch (i) {
            case 0: return 'A';
            case 1: return 'B';
            case 2: return 'C';
            case 3: return 'D';
        }
    };
    PracticeListenPage.prototype.playAudio = function (audioUrl) {
        var file = new MediaPlugin(audioUrl);
        console.log(audioUrl);
        file.init.then(function () {
            console.log('Playback Finished');
            file.release();
        }, function (err) {
            console.log(err);
            console.log('somthing went wrong! error code: ' + err.code + ' message: ' + err.message);
        });
        file.play();
    };
    PracticeListenPage.prototype.selectAnswer = function (myAnswer) {
        var _this = this;
        var id = myAnswer.id;
        var audioUrl = '';
        this.listClasses = [];
        if (this.platform.is('android')) {
            audioUrl = '/android_asset/www/assets/audios/';
        }
        else {
            audioUrl = './assets/audios/';
        }
        if (id == this.currentQuestion.correctAnswer.id) {
            this.listClasses[id] = 'checked-correct';
            audioUrl += 'answer_right.mp3';
            this.playAudio(audioUrl);
            setTimeout(function () {
                _this.nextQuestion();
            }, 500);
        }
        else {
            this.listClasses[id] = 'checked-wrong';
            audioUrl += 'answer_wrong.mp3';
            this.playAudio(audioUrl);
        }
    };
    PracticeListenPage.prototype.selectAns = function (ID) {
        $("page-practice-listen .answer").removeClass("checked");
        $("page-practice-listen .answer-" + ID).addClass("checked");
    };
    PracticeListenPage.prototype.nextQuestion = function () {
        var _this = this;
        if (this.currentIndex >= 0 && this.currentIndex < this.listQuestions.length) {
            ++this.currentIndex;
            $("page-practice-listen ion-content").fadeOut(500, function () {
                _this.currentQuestion = _this.listQuestions[_this.currentIndex];
                $("page-practice-listen ion-content").fadeIn(500, function () {
                    setTimeout(function () {
                        _this.playAudio(_this.currentQuestion.correctAnswer.audio);
                    }, 600);
                });
            });
        }
    };
    return PracticeListenPage;
}());
PracticeListenPage = __decorate([
    Component({
        selector: 'page-practice-listen',
        templateUrl: 'practice-listen.html',
        providers: [CourseService]
    }),
    __metadata("design:paramtypes", [NavController, NavParams, LoadingController, Platform,
        CourseService, DatabaseService])
], PracticeListenPage);
export { PracticeListenPage };
//# sourceMappingURL=practice-listen.js.map