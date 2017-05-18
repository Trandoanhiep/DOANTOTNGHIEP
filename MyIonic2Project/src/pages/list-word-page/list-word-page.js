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
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
//modal
import { DetailWordModal } from '../modal-detail-word/modal-detail-word';
//page
import { PracticePage } from '../practice/practice';
//service
import { CourseService } from '../../providers/course-service';
import { DatabaseService } from '../../providers/database-service';
/*
  Generated class for the ListWordPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var ListWordPagePage = (function () {
    function ListWordPagePage(navCtrl, navParams, modalCtrl, courseService, databaseService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.courseService = courseService;
        this.databaseService = databaseService;
        this.listWords = [];
        this.lesson = navParams.get('lesson');
        this.course = navParams.get('course');
        this.databaseService.getAllWords(this.lesson.id)
            .then(function (data) {
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
                        image: _this.courseService.getUrlImageWord(_this.course.id, data.rows.item(i).id),
                        audio: _this.courseService.getUrlAudioWord(_this.course.id, data.rows.item(i).id),
                    };
                    _this.listWords.push(e);
                }
            }
        }, function (err) {
            console.error('Lỗi get lessons: ', err);
        });
    }
    ListWordPagePage.prototype.playAudio = function (event, audioUrrl) {
        var _this = this;
        event.stopPropagation();
        this.file = new MediaPlugin(audioUrrl);
        this.file.init.then(function () {
            console.log('Playback Finished');
            _this.file.release();
        }, function (err) {
            console.log('somthing went wrong! error code: ' + err.code + ' message: ' + err.message);
        });
        this.file.play();
    };
    ListWordPagePage.prototype.stopAudio = function () {
        this.file.stop();
    };
    ListWordPagePage.prototype.showDetailWord = function (word) {
        var profileModal = this.modalCtrl.create(DetailWordModal, { word: word });
        profileModal.present();
    };
    ListWordPagePage.prototype.goToPractice = function () {
        this.navCtrl.push(PracticePage, { params: "lesson" });
    };
    return ListWordPagePage;
}());
ListWordPagePage = __decorate([
    Component({
        selector: 'page-list-word-page',
        templateUrl: 'list-word-page.html',
        providers: [CourseService]
    }),
    __metadata("design:paramtypes", [NavController, NavParams, ModalController,
        CourseService, DatabaseService])
], ListWordPagePage);
export { ListWordPagePage };
//# sourceMappingURL=list-word-page.js.map