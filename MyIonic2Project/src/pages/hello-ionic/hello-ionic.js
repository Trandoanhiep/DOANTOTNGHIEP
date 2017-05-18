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
import { NavController, LoadingController, NavParams, ModalController } from 'ionic-angular';
//page
import { ListWordPagePage } from '../list-word-page/list-word-page';
import { PracticePage } from '../practice/practice';
//modal
// import { SampleModalPage } from '../modal-test/modal-test';
//service 
import { CourseService } from '../../providers/course-service';
import { VariableService } from '../../providers/variable-service';
import { DatabaseService } from '../../providers/database-service';
var HelloIonicPage = (function () {
    function HelloIonicPage(navCtrl, loadingCtrl, navParams, modalCtrl, courseService, databaseService, globalVariable) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.courseService = courseService;
        this.databaseService = databaseService;
        this.globalVariable = globalVariable;
        this.a = "";
        this.listLessons = [];
        this.urlImg = "";
        this.HOST = this.globalVariable.HOST;
        // this.presentLoadingDefault();
        this.course = navParams.get('course');
        this.databaseService.getAllLessons(this.course.id)
            .then(function (data) {
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    var e = { id: 0, course_id: 0, name: '', num_word: 0, image: '' };
                    e = {
                        id: data.rows.item(i).id,
                        course_id: data.rows.item(i).course_id,
                        name: data.rows.item(i).name,
                        num_word: data.rows.item(i).num_word,
                        image: _this.courseService.getUrlImageLesson(_this.course.id, data.rows.item(i).id)
                    };
                    _this.listLessons.push(e);
                }
            }
        }, function (err) {
            console.error('Lỗi get lessons: ', err);
        });
    }
    HelloIonicPage.prototype.selectLesson = function (lesson) {
        this.navCtrl.push(ListWordPagePage, { lesson: lesson, course: this.course });
    };
    HelloIonicPage.prototype.goToPractice = function () {
        this.navCtrl.push(PracticePage, { courseId: this.course.id });
    };
    return HelloIonicPage;
}());
HelloIonicPage = __decorate([
    Component({
        selector: 'page-hello-ionic',
        templateUrl: 'hello-ionic.html',
        providers: [CourseService, VariableService]
    }),
    __metadata("design:paramtypes", [NavController, LoadingController, NavParams,
        ModalController, CourseService,
        DatabaseService, VariableService])
], HelloIonicPage);
export { HelloIonicPage };
//# sourceMappingURL=hello-ionic.js.map