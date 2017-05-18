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
import { NavController, NavParams } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
import { CourseService } from '../../providers/course-service';
import { DatabaseService } from '../../providers/database-service';
import * as $ from "jquery";
/*
  Generated class for the PracticeFlashcard page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var PracticeFlashcardPage = (function () {
    function PracticeFlashcardPage(navCtrl, navParams, courseService, databaseService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.courseService = courseService;
        this.databaseService = databaseService;
        this.listFlashcards = [];
        this.currentIndex = 0;
        this.currentFlashcard = { id: '', front: {}, back: {} };
        this.courseId = navParams.get('courseId');
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
                _this.listFlashcards = _this.courseService.generateFlashcardPractice(listWords);
                _this.listFlashcards = _this.listFlashcards.splice(0, 10);
                _this.currentFlashcard = _this.listFlashcards[_this.currentIndex];
                console.log(_this.currentFlashcard);
            }
        }, function (err) {
            console.error('Lỗi get lessons: ', err);
        });
    }
    PracticeFlashcardPage.prototype.flip = function (id) {
        $(".card-" + id).toggleClass("flipped");
    };
    PracticeFlashcardPage.prototype.playAudio = function (event, audioUrrl) {
        event.stopPropagation();
        var file = new MediaPlugin(audioUrrl);
        file.init.then(function () {
            file.release();
        }, function (err) {
            console.log('somthing went wrong! error code: ' + err.code + ' message: ' + err.message);
        });
        file.play();
    };
    return PracticeFlashcardPage;
}());
PracticeFlashcardPage = __decorate([
    Component({
        selector: 'page-practice-flashcard',
        templateUrl: 'practice-flashcard.html',
        providers: [CourseService]
    }),
    __metadata("design:paramtypes", [NavController, NavParams,
        CourseService, DatabaseService])
], PracticeFlashcardPage);
export { PracticeFlashcardPage };
//# sourceMappingURL=practice-flashcard.js.map