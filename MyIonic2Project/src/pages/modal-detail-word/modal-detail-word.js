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
import { ViewController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
import { DatabaseService } from '../../providers/database-service';
var DetailWordModal = (function () {
    function DetailWordModal(viewCtrl, navParams, alertCtrl, toastCtrl, databaseService) {
        this.viewCtrl = viewCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.databaseService = databaseService;
        this.word = this.navParams.get("word");
    }
    DetailWordModal.prototype.dismiss = function (data) {
        this.viewCtrl.dismiss(data);
    };
    DetailWordModal.prototype.playAudio = function (audioUrrl) {
        var _this = this;
        this.file = new MediaPlugin(audioUrrl);
        this.file.init.then(function () {
            _this.file.release();
        }, function (err) {
            console.log('lỗi phát mp3');
            console.log('somthing went wrong! error code: ' + err.code + ' message: ' + err.message);
        });
        this.file.play();
    };
    DetailWordModal.prototype.showAddExamplePopup = function (e) {
        var _this = this;
        e.stopPropagation();
        var alert = this.alertCtrl.create({
            title: 'Thêm ví dụ',
            cssClass: 'add-example-popup',
            inputs: [
                {
                    name: 'example',
                    placeholder: 'Thêm ví dụ'
                },
                {
                    name: 'exampleMean',
                    placeholder: 'Thêm nghĩa'
                }
            ],
            buttons: [
                {
                    text: 'Bỏ',
                    role: 'cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                        alert.dismiss();
                    }
                },
                {
                    text: 'Thêm',
                    handler: function (data) {
                        var example = data.example, exampleMean = data.exampleMean;
                        if (example.length == 0 || exampleMean.length == 0) {
                            var toast = _this.toastCtrl.create({
                                message: 'Vui lòng nhập đầy đủ thông tin !',
                                duration: 3000,
                                position: 'top'
                            });
                            toast.present();
                        }
                        else {
                            _this.word.example = example;
                            _this.word.example_mean = exampleMean;
                            _this.databaseService.updateWord(_this.word).then(function () {
                                alert.dismiss();
                            });
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    return DetailWordModal;
}());
DetailWordModal = __decorate([
    Component({
        selector: 'modal-detail-word',
        templateUrl: 'modal-detail-word.html'
    }),
    __metadata("design:paramtypes", [ViewController, NavParams, AlertController, ToastController,
        DatabaseService])
], DetailWordModal);
export { DetailWordModal };
//# sourceMappingURL=modal-detail-word.js.map