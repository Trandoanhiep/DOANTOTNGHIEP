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
import { TestListeningPage } from '../test-listening/test-listening';
import { TestReadingPage } from '../test-reading/test-reading';
import { DatabaseService } from '../../providers/database-service';
import { ToeicService } from '../../providers/toeic-service';
/*
  Generated class for the TestDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var TestDetailPage = (function () {
    function TestDetailPage(navCtrl, navParams, toeicService, databaseService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toeicService = toeicService;
        this.databaseService = databaseService;
        this.isShowResult = false;
        this.detailScore = 'listening';
        this.trueIcon = './assets/icon/true-icon.png';
        this.falseIcon = './assets/icon/false-icon.png';
        this.result = null;
        this.test = navParams.get('test');
        this.RL = [
            {
                name: "Phần Listening",
                image: "md-headset",
                page: TestListeningPage,
                data: {
                    idTest: this.test.idTest,
                    part1: this.test.part1,
                    part2: this.test.part2,
                    part3: this.test.part3,
                    part4: this.test.part4
                }
            },
            {
                name: "Phần Reading",
                image: "md-create",
                page: TestReadingPage,
                data: {
                    idTest: this.test.idTest,
                    part5: this.test.part5,
                    part6: this.test.part6,
                    part7: this.test.part7
                }
            }
        ];
    }
    TestDetailPage.prototype.selectTest = function (page, data) {
        this.navCtrl.push(page, { data: data });
    };
    TestDetailPage.prototype.showResult = function () {
        var _this = this;
        if (this.isShowResult) {
            this.isShowResult = !this.isShowResult;
        }
        else {
            if (!this.result) {
                var result_1 = [];
                this.databaseService.getResultToeic(this.test.idTest)
                    .then(function (data) {
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            result_1.push(data.rows.item(i));
                        }
                        _this.toeicService.calcToeicScore(result_1).then(function (data) {
                            _this.result = data;
                            _this.isShowResult = !_this.isShowResult;
                        });
                    }
                });
            }
            else {
                this.isShowResult = !this.isShowResult;
            }
        }
    };
    TestDetailPage.prototype.showDetailScore = function (type) {
        this.detailScore = type;
    };
    return TestDetailPage;
}());
TestDetailPage = __decorate([
    Component({
        selector: 'page-test-detail',
        templateUrl: 'test-detail.html',
        providers: [ToeicService]
    }),
    __metadata("design:paramtypes", [NavController, NavParams,
        ToeicService, DatabaseService])
], TestDetailPage);
export { TestDetailPage };
//# sourceMappingURL=test-detail.js.map