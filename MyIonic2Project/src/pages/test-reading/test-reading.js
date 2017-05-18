var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar, AlertController, ToastController } from 'ionic-angular';
import { ToeicService } from '../../providers/toeic-service';
import { DatabaseService } from '../../providers/database-service';
import * as $ from "jquery";
/*
  Generated class for the TestReading page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var TestReadingPage = (function () {
    function TestReadingPage(navCtrl, navParams, alertCtrl, toastCtrl, toeicService, databaseService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.toeicService = toeicService;
        this.databaseService = databaseService;
        this.time = { minute: 75, second: 0 };
        this.idObj = { part5: '', part6: '', part7: '' };
        this.currentPart = 5;
        this.result = [];
        this.idTest = navParams.get('data').idTest;
        this.idObj.part5 = navParams.get('data').part5;
        this.idObj.part6 = navParams.get('data').part6;
        this.idObj.part7 = navParams.get('data').part7;
        this.countTime();
        this.getData();
    }
    TestReadingPage.prototype.ionViewWillLeave = function () {
        clearInterval(this.interval);
    };
    TestReadingPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.navBar.backButtonClick = function (e) {
            var confirm = _this.alertCtrl.create({
                title: 'Thông báo',
                message: 'Bài thi chưa được submit . Bạn chắc chắn muốn thoát ?',
                buttons: [
                    { text: 'Không',
                        handler: function () {
                        }
                    },
                    { text: 'Đồng ý',
                        handler: function () {
                            _this.navCtrl.pop();
                        }
                    }
                ]
            });
            confirm.present();
        };
    };
    TestReadingPage.prototype.countTime = function () {
        var _this = this;
        this.interval = setInterval(function () {
            if (_this.time.second > 0) {
                _this.time.second--;
            }
            else {
                _this.time.second = 59;
                _this.time.minute--;
            }
            if (_this.time.minute == 0 && _this.time.second == 0) {
                console.log('hết giờ');
                clearInterval(_this.interval);
            }
        }, 1000);
    };
    TestReadingPage.prototype.getData = function () {
        var _this = this;
        this.toeicService.getPartData(this.idTest, this.idObj.part5)
            .subscribe(function (listQuestion) {
            _this.dataPart5 = listQuestion;
        });
        this.toeicService.getPartData(this.idTest, this.idObj.part6)
            .subscribe(function (listQuestion) {
            _this.dataPart6 = listQuestion;
        });
        this.toeicService.getPartData(this.idTest, this.idObj.part7)
            .subscribe(function (listQuestion) {
            _this.dataPart7 = listQuestion;
        });
    };
    TestReadingPage.prototype.makeid = function (length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };
    TestReadingPage.prototype.selectPart = function (part) {
        if ((part - this.currentPart) == 1) {
            this.getAnswersOfUser(this.currentPart);
            //reset mọi thứ về ban đầu
            $("page-test-reading .list-tabs .part-" + this.currentPart).addClass("disable");
            this.currentPart = part;
            $("page-test-reading .item-tab").removeClass("active-tab");
            $("page-test-reading .list-tabs .part-" + part).addClass("active-tab");
        }
        else {
            var toast = this.toastCtrl.create({
                message: 'Bạn phải làm theo lần lượt từng part !',
                duration: 3000,
                position: 'top'
            });
            toast.present();
        }
    };
    TestReadingPage.prototype.finishPart = function (part) {
        this.selectPart(++part);
    };
    TestReadingPage.prototype.getAnswersOfUser = function (part) {
        var fromQ, toQ;
        var data = [];
        if (part == 5) {
            fromQ = 101;
            toQ = 140;
            data = this.dataPart5;
        }
        else if (part == 6) {
            fromQ = 141;
            toQ = 152;
            for (var i = 0; i < this.dataPart6.length; ++i)
                for (var j = 0; j < this.dataPart6[i].listquestion.length; ++j)
                    data.push(this.dataPart6[i].listquestion[j]);
        }
        else if (part == 7) {
            fromQ = 153;
            toQ = 200;
            for (var i = 0; i < this.dataPart7.length; ++i)
                for (var j = 0; j < this.dataPart7[i].listquestion.length; ++j)
                    data.push(this.dataPart7[i].listquestion[j]);
        }
        for (var i = fromQ; i <= toQ; ++i) {
            var answer = {
                id: this.makeid(32),
                idTest: this.idTest,
                idQuestion: i,
                myAnswer: $("input[name='answers-" + i + "']:checked").val(),
                correctAnswer: data[i - fromQ].answerCorrect
            };
            this.result.push(answer);
        }
        console.log(this.result);
    };
    TestReadingPage.prototype.submit = function () {
        var _this = this;
        this.databaseService.saveResultToeic(this.idTest, this.result)
            .then(function (data) {
            if (data) {
                _this.navCtrl.pop();
            }
            else {
                console.log("có lỗi khi save");
            }
        });
    };
    return TestReadingPage;
}());
__decorate([
    ViewChild(Navbar),
    __metadata("design:type", Navbar)
], TestReadingPage.prototype, "navBar", void 0);
TestReadingPage = __decorate([
    Component({
        selector: 'page-test-reading',
        templateUrl: 'test-reading.html',
        providers: [ToeicService]
    }),
    __metadata("design:paramtypes", [NavController, NavParams, AlertController, ToastController,
        ToeicService, DatabaseService])
], TestReadingPage);
export { TestReadingPage };
//# sourceMappingURL=test-reading.js.map