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
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { TestDetailPage } from '../test-detail/test-detail';
import { Facebook } from 'ionic-native';
import { ToeicService } from '../../providers/toeic-service';
import { DatabaseService } from '../../providers/database-service';
import { DownloadService } from '../../providers/download-service';
var TestPage = (function () {
    function TestPage(navCtrl, navParams, alertCtrl, loadingCtrl, toeicService, databaseService, downloadService) {
        // 	this.userObj = {
        // 			name: "",
        // 			gender: "",
        // 			picture: ""
        // };
        // 	Facebook.browserInit(this.FB_APP_ID, "v2.5");
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.toeicService = toeicService;
        this.databaseService = databaseService;
        this.downloadService = downloadService;
        this.FB_APP_ID = 172914093182785;
        this.listToeicTest = [];
        this.databaseService.getAllToeicTests()
            .then(function (data) {
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    _this.listToeicTest.push(data.rows.item(i));
                }
                console.log(_this.listToeicTest);
            }
        });
    }
    TestPage.prototype.login = function () {
        var _this = this;
        var permissions = new Array();
        permissions = ["public_profile"];
        Facebook.login(permissions).then(function (response) {
            var userId = response.authResponse.userID;
            var params = new Array();
            //Getting name and gender properties
            Facebook.api("/me?fields=name,gender", params).then(function (user) {
                user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
                //now we have the users info, let's save it in the NativeStorage
                _this.userObj = {
                    name: user.name,
                    gender: user.gender,
                    picture: user.picture
                };
            });
        }, function (error) {
            console.log(error);
        });
    };
    TestPage.prototype.selectToeicTest = function (test) {
        var _this = this;
        if (test.downloaded == 1) {
            var listPart = test.idTest.split("-");
            var obj = {
                idTest: test.idTest,
                reading: 0,
                listening: 0,
                finished: 0,
                part1: listPart[0],
                part2: listPart[1],
                part3: listPart[2],
                part4: listPart[3],
                part5: listPart[4],
                part6: listPart[5],
                part7: listPart[6],
            };
            this.navCtrl.push(TestDetailPage, { test: obj });
        }
        else {
            var confirm_1 = this.alertCtrl.create({
                title: 'Thông báo',
                message: 'Bạn cần tải dữ liệu để có thể làm bài thi ?',
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
                            _this.downloadService.downloadToeicTest(test.idTest, loadingDownload, loadingUnzip)
                                .then(function (result) {
                                if (result === 0) {
                                    console.log('Unzip SUCCESS');
                                    test.downloaded = 1;
                                    _this.databaseService.updateTest(test).then(function () {
                                        for (var i = 0; i < _this.listToeicTest.length; ++i) {
                                            if (_this.listToeicTest[i].idTest == test.idTest) {
                                                console.log('update test SUCCESS');
                                                _this.listToeicTest[i].downloaded = 1;
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
    return TestPage;
}());
TestPage = __decorate([
    Component({
        selector: 'page-test',
        templateUrl: 'test.html',
        providers: [ToeicService]
    }),
    __metadata("design:paramtypes", [NavController, NavParams, AlertController, LoadingController,
        ToeicService, DatabaseService, DownloadService])
], TestPage);
export { TestPage };
//# sourceMappingURL=test.js.map