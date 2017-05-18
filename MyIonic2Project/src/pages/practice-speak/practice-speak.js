var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone } from '@angular/core';
import { Platform, NavController, NavParams, LoadingController } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
import { CourseService } from '../../providers/course-service';
import { DatabaseService } from '../../providers/database-service';
import * as $ from "jquery";
var PracticeSpeakPage = (function () {
    function PracticeSpeakPage(platform, navCtrl, navParams, zone, loadingCtrl, courseService, databaseService) {
        var _this = this;
        this.platform = platform;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.zone = zone;
        this.loadingCtrl = loadingCtrl;
        this.courseService = courseService;
        this.databaseService = databaseService;
        this.isSpeaking = false;
        this.text = '';
        this.courseId = '';
        this.currentIndex = 0;
        this.listQuestions = [];
        this.currentQuestion = { word: '', phonetic: '', audio: '' };
        this.speechToText();
        this.courseId = navParams.get('courseId');
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this.databaseService.getAllWordsOfCourse(this.courseId)
            .then(function (data) {
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    var e = { id: 0, subject_id: 0, course_id: 0, word: '', phonetic: '',
                        mean: '', example: '', example_mean: '', audio: '' };
                    e = {
                        id: data.rows.item(i).id,
                        subject_id: data.rows.item(i).subject_id,
                        course_id: data.rows.item(i).course_id,
                        word: data.rows.item(i).word,
                        phonetic: data.rows.item(i).phonetic,
                        mean: data.rows.item(i).mean,
                        example: data.rows.item(i).example,
                        example_mean: data.rows.item(i).example_mean,
                        audio: _this.courseService.getUrlAudioWord(_this.courseId, data.rows.item(i).id),
                    };
                    _this.listQuestions.push(e);
                }
                _this.listQuestions = _this.courseService.shuffleArray(_this.listQuestions);
                _this.currentQuestion = _this.listQuestions[_this.currentIndex];
                console.log(_this.currentQuestion);
                loading.dismiss();
            }
        }, function (err) {
            console.error('Lỗi get lessons: ', err);
        });
    }
    PracticeSpeakPage.prototype.playAudio = function (audioUrl) {
        var file = new MediaPlugin(audioUrl);
        file.init.then(function () {
            console.log('Playback Finished');
            file.release();
        }, function (err) {
            console.log('somthing went wrong! error code: ' + err.code + ' message: ' + err.message);
        });
        file.play();
    };
    PracticeSpeakPage.prototype.speak = function () {
        this.isSpeaking = !this.isSpeaking;
        this.recognition.start();
    };
    PracticeSpeakPage.prototype.speechToText = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.recognition = new SpeechRecognition();
            _this.recognition.lang = 'en-US';
            _this.recognition.onnomatch = (function (event) {
                console.log('No match found.');
            });
            _this.recognition.onerror = (function (event) {
                console.log('Error happens.');
                _this.isSpeaking = false;
                _this.zone.run(function () { });
            });
            _this.recognition.onresult = (function (event) {
                if (event.results.length > 0) {
                    console.log('Output STT: ', event.results[0][0].transcript);
                    _this.text = event.results[0][0].transcript.toLowerCase();
                    _this.isSpeaking = false;
                    _this.zone.run(function () { });
                    var quality = _this.courseService.getSimilarityOfString(_this.text, _this.currentQuestion.word);
                    console.log("bạn nói đúng : " + quality);
                }
            });
            _this.recognition.onend = (function (event) {
                console.log('ended');
            });
        });
    };
    PracticeSpeakPage.prototype.nextQuestion = function () {
        var _this = this;
        if (this.currentIndex >= 0 && this.currentIndex < this.listQuestions.length) {
            ++this.currentIndex;
            $("page-practice-speak ion-content").fadeOut(500, function () {
                _this.currentQuestion = _this.listQuestions[_this.currentIndex];
                $("page-practice-speak ion-content").fadeIn(500, function () {
                });
            });
        }
    };
    return PracticeSpeakPage;
}());
PracticeSpeakPage = __decorate([
    Component({
        selector: 'page-practice-speak',
        templateUrl: 'practice-speak.html',
        providers: [CourseService]
    }),
    __metadata("design:paramtypes", [Platform, NavController, NavParams, NgZone, LoadingController,
        CourseService, DatabaseService])
], PracticeSpeakPage);
export { PracticeSpeakPage };
//# sourceMappingURL=practice-speak.js.map