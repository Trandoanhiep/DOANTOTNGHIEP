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
import { ViewController, NavParams, ModalController, AlertController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { RegisterModal } from '../modal-register/modal-register';
import { VariableService } from '../../providers/variable-service';
import { DatabaseService } from '../../providers/database-service';
var LoginModal = (function () {
    function LoginModal(viewCtrl, navParams, modalCtrl, alertCtrl, toastCtrl, http, globalVariable, databaseService) {
        this.viewCtrl = viewCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.http = http;
        this.globalVariable = globalVariable;
        this.databaseService = databaseService;
        this.email = '';
        this.password = '';
    }
    LoginModal.prototype.dismiss = function (data) {
        this.viewCtrl.dismiss(data);
    };
    LoginModal.prototype.showRegisterModal = function () {
        var profileModal = this.modalCtrl.create(RegisterModal);
        profileModal.present();
    };
    LoginModal.prototype.login = function () {
        var _this = this;
        var url = this.globalVariable.HOST + '/api/login?email=' + this.email.trim() + "&password=" + this.password.trim() + "&type=0";
        return this.http.get(url).map(function (res) { return res.json(); }).subscribe(function (data) {
            if (data.length > 0) {
                _this.databaseService.deleteUser().then(function () {
                    _this.databaseService.addUser(data[0])
                        .then(function () {
                        var toast = _this.toastCtrl.create({
                            message: 'Đăng nhập thành công !',
                            duration: 3000,
                            position: 'top'
                        });
                        toast.onDidDismiss(function () {
                            _this.dismiss(null);
                        });
                        toast.present();
                    });
                });
            }
            else {
                var alert_1 = _this.alertCtrl.create({
                    title: 'Thông báo',
                    subTitle: 'Sai tài khoản hoặc mật khẩu ! Vui lòng nhập lại',
                    buttons: ['OK']
                });
                alert_1.present();
            }
        }, function (error) {
            var alert = _this.alertCtrl.create({
                title: 'Thông báo',
                subTitle: 'Có lỗi khi đăng nhập ! Vui lòng đăng nhập lại',
                buttons: ['OK']
            });
            alert.present();
        });
    };
    LoginModal.prototype.loginWithFB = function () {
    };
    return LoginModal;
}());
LoginModal = __decorate([
    Component({
        selector: 'modal-login',
        templateUrl: 'modal-login.html',
        providers: [VariableService]
    }),
    __metadata("design:paramtypes", [ViewController, NavParams, ModalController,
        AlertController, ToastController, Http,
        VariableService, DatabaseService])
], LoginModal);
export { LoginModal };
//# sourceMappingURL=modal-login.js.map