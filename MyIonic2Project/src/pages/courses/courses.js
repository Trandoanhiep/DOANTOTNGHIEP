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
import { Platform, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
//page
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { TestPage } from '../test/test';
import { ForumPage } from '../forum/forum';
//service 
import { CourseService } from '../../providers/course-service';
import { DatabaseService } from '../../providers/database-service';
import { DownloadService } from '../../providers/download-service';
import { Emitter } from '../../providers/rootscope-service';
//Classes
import { Course } from '../../classes/Course';
var CoursesPage = (function () {
    function CoursesPage(platform, navCtrl, navParams, alertCtrl, loadingCtrl, courseService, databaseService, downloadService, scope) {
        var _this = this;
        this.platform = platform;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.courseService = courseService;
        this.databaseService = databaseService;
        this.downloadService = downloadService;
        this.scope = scope;
        this.listCourses = [];
        this.l = [];
        this.currentUser = null;
        this.getData();
        this.scope.on('initCourseTableSuccess')
            .subscribe(function (data) {
            _this.getData();
        });
        this.pages = [
            { title: 'Forum', component: ForumPage, icon: 'ios-contacts' },
            { title: 'Toeic', component: TestPage, icon: 'ios-create' },
            { title: 'Cài đặt', component: TestPage, icon: 'ios-settings' }
        ];
        this.databaseService.getUser()
            .then(function (data) {
            if (data.rows.length > 0) {
                _this.currentUser = data.rows.item(0);
            }
            else {
                _this.currentUser = null;
            }
        }, function (err) {
            console.error('Lỗi get user: ', err);
        });
        //test
        var a = new Course(1, 'name', 0, 10, 100, 'course.png');
        console.log(a);
        console.log(a.image);
        a.downloaded = 10;
        console.log(a.image);
    }
    CoursesPage.prototype.getData = function () {
        var _this = this;
        this.databaseService.getAllCourses()
            .then(function (data) {
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    data.rows.item(i).image = _this.courseService.getUrlImageCourse(data.rows.item(i).id);
                    _this.listCourses.push(data.rows.item(i));
                }
                console.log(_this.listCourses);
            }
        }, function (err) {
            console.error('Lỗi get all course: ', err);
        });
    };
    CoursesPage.prototype.ionViewDidEnter = function () {
        console.log("Did Enter 11111111");
    };
    CoursesPage.prototype.selectCourse = function (course) {
        var _this = this;
        if (course.downloaded == 1) {
            this.navCtrl.push(HelloIonicPage, { course: course });
        }
        else {
            var confirm_1 = this.alertCtrl.create({
                title: 'Thông báo',
                message: 'Bạn cần tải dữ liệu về để có thể dùng cho những lần sau ?',
                buttons: [
                    { text: 'Không',
                        handler: function () {
                        }
                    },
                    { text: 'Đồng ý',
                        handler: function () {
                            var loadingDownload = _this.loadingCtrl.create({
                                content: 'Đang tải dữ liệu  0%'
                            });
                            var loadingUnzip = _this.loadingCtrl.create({
                                content: 'Đang cài đặt dữ liệu  0%'
                            });
                            _this.downloadService.downloadCourse(course.id, loadingDownload, loadingUnzip)
                                .then(function (result) {
                                if (result === 0) {
                                    console.log('Unzip SUCCESS');
                                    _this.databaseService.importDataIntoDB(course)
                                        .then(function () {
                                        for (var i = 0; i < _this.listCourses.length; ++i) {
                                            if (_this.listCourses[i].id == course.id) {
                                                _this.listCourses[i].downloaded = 1;
                                                break;
                                            }
                                        }
                                    });
                                }
                            }, function (error) {
                                console.log('Lỗi giải nén');
                            });
                        }
                    }
                ]
            });
            confirm_1.present();
        }
    };
    CoursesPage.prototype.openPage = function (page) {
        this.navCtrl.push(page.component, { currentUser: this.currentUser });
    };
    return CoursesPage;
}());
CoursesPage = __decorate([
    Component({
        selector: 'page-courses',
        templateUrl: 'courses.html',
        providers: [CourseService] //
    }),
    __metadata("design:paramtypes", [Platform, NavController, NavParams, AlertController, LoadingController,
        CourseService, DatabaseService, DownloadService, Emitter])
], CoursesPage);
export { CoursesPage };
//# sourceMappingURL=courses.js.map