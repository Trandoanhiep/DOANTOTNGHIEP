var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, Navbar, AlertController, ToastController } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
import { ToeicService } from '../../providers/toeic-service';
import { DatabaseService } from '../../providers/database-service';
import * as $ from "jquery";
var TestListeningPage = (function () {
    function TestListeningPage(navCtrl, navParams, alertCtrl, toastCtrl, zone, toeicService, databaseService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.zone = zone;
        this.toeicService = toeicService;
        this.databaseService = databaseService;
        this.timePlayAudio = 0;
        this.currentPart = 1;
        this.iconAudio = 'play';
        this.file = null;
        this.idObj = { part1: '', part2: '', part3: '', part4: '' };
        this.dataPart1 = { data: [], audio: '' };
        this.dataPart2 = { data: [], audio: '' };
        this.dataPart3 = { data: [], audio: '' };
        this.dataPart4 = { data: [], audio: '' };
        this.result = [];
        this.time = { minute: 45, second: 0 };
        this.idTest = navParams.get('data').idTest;
        this.idObj.part1 = navParams.get('data').part1;
        this.idObj.part2 = navParams.get('data').part2;
        this.idObj.part3 = navParams.get('data').part3;
        this.idObj.part4 = navParams.get('data').part4;
        this.getData();
        this.countTime();
    }
    TestListeningPage.prototype.ionViewWillLeave = function () {
        clearInterval(this.interval);
        if (this.file != null)
            this.file.release();
    };
    TestListeningPage.prototype.ionViewDidLoad = function () {
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
    TestListeningPage.prototype.getData = function () {
        var _this = this;
        this.toeicService.getPartData(this.idTest, this.idObj.part1)
            .subscribe(function (listQuestion) {
            for (var i = 0; i < listQuestion.length; ++i) {
                listQuestion[i].image = _this.toeicService.getImagePart1(_this.idTest, _this.idObj.part1, listQuestion[i].idQuestion);
            }
            _this.dataPart1 = {
                data: listQuestion,
                audio: _this.toeicService.getAudioListening(_this.idTest, _this.idObj.part1)
            };
        });
        this.toeicService.getPartData(this.idTest, this.idObj.part2)
            .subscribe(function (listQuestion) {
            _this.dataPart2 = {
                data: listQuestion,
                audio: _this.toeicService.getAudioListening(_this.idTest, _this.idObj.part2)
            };
        });
        this.toeicService.getPartData(this.idTest, this.idObj.part3)
            .subscribe(function (listQuestion) {
            _this.dataPart3 = {
                data: listQuestion,
                audio: _this.toeicService.getAudioListening(_this.idTest, _this.idObj.part3)
            };
        });
        this.toeicService.getPartData(this.idTest, this.idObj.part4)
            .subscribe(function (listQuestion) {
            _this.dataPart4 = {
                data: listQuestion,
                audio: _this.toeicService.getAudioListening(_this.idTest, _this.idObj.part4)
            };
        });
    };
    TestListeningPage.prototype.countTime = function () {
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
                console.log('hiển thi alert thông báo xong this.submit()');
                clearInterval(_this.interval);
            }
        }, 1000);
    };
    TestListeningPage.prototype.selectPart = function (part) {
        if ((part - this.currentPart) == 1) {
            //lấy kết quả của part sau đó mới chuyển tab
            this.getAnswersOfUser(this.currentPart);
            //reset mọi thứ về ban đầu
            $("page-test-listening .list-tabs .part-" + this.currentPart).addClass("disable");
            this.iconAudio = 'play';
            if (this.file != null)
                this.file.release();
            this.timePlayAudio = 0;
            this.currentPart = part;
            $("page-test-listening .item-tab").removeClass("active-tab");
            $("page-test-listening .list-tabs .part-" + part).addClass("active-tab");
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
    TestListeningPage.prototype.playAudio = function (audioUrrl, part) {
        var _this = this;
        var interval = setInterval(function () {
            _this.timePlayAudio++;
            _this.file.getCurrentPosition().then(function (position) {
                var duration = _this.file.getDuration();
                _this.timePlayAudio = Math.floor((position * 100) / duration);
            });
        }, 3000 * part);
        if (this.iconAudio == 'play') {
            this.iconAudio = 'pause';
            $("page-test-listening .audio-icon-p" + part).addClass("disable");
        }
        else {
            this.iconAudio = 'play';
        }
        this.file = new MediaPlugin(audioUrrl);
        this.file.init.then(function () {
            console.log('Playback Finished');
            _this.iconAudio = 'play';
            clearInterval(interval);
            _this.file.release();
        }, function (err) {
            console.log('somthing went wrong! error code: ' + err.code + ' message: ' + err.message);
        });
        this.file.play();
    };
    TestListeningPage.prototype.makeid = function (length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };
    TestListeningPage.prototype.getAnswersOfUser = function (part) {
        var fromQ, toQ;
        var data;
        if (part == 1) {
            fromQ = 1;
            toQ = 10;
            data = this.dataPart1.data;
        }
        else if (part == 2) {
            fromQ = 11;
            toQ = 40;
            data = this.dataPart2.data;
        }
        else if (part == 3) {
            fromQ = 41;
            toQ = 70;
            data = this.dataPart3.data;
        }
        else if (part == 4) {
            fromQ = 71;
            toQ = 100;
            data = this.dataPart4.data;
            clearInterval(this.interval);
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
    TestListeningPage.prototype.finishPart = function (part) {
        this.selectPart(++part);
    };
    TestListeningPage.prototype.submit = function () {
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
    return TestListeningPage;
}());
__decorate([
    ViewChild(Navbar),
    __metadata("design:type", Navbar)
], TestListeningPage.prototype, "navBar", void 0);
TestListeningPage = __decorate([
    Component({
        selector: 'page-test-listening',
        templateUrl: 'test-listening.html',
        providers: [ToeicService]
    }),
    __metadata("design:paramtypes", [NavController, NavParams, AlertController, ToastController, NgZone,
        ToeicService, DatabaseService])
], TestListeningPage);
export { TestListeningPage };
//# sourceMappingURL=test-listening.js.map