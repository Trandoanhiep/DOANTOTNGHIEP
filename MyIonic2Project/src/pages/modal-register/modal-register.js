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
import { VariableService } from '../../providers/variable-service';
import { DatabaseService } from '../../providers/database-service';
var RegisterModal = (function () {
    function RegisterModal(viewCtrl, navParams, modalCtrl, alertCtrl, toastCtrl, http, globalVariable, databaseService) {
        this.viewCtrl = viewCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.http = http;
        this.globalVariable = globalVariable;
        this.databaseService = databaseService;
        this.fullname = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
    }
    RegisterModal.prototype.dismiss = function (data) {
        this.viewCtrl.dismiss(data);
    };
    RegisterModal.prototype.register = function () {
        var _this = this;
        var url = this.globalVariable.HOST + '/api/register?email=' + this.email.trim() + "&password=" + this.password.trim() +
            "&type=0&fullname=" + this.fullname.trim();
        return this.http.get(url).map(function (res) { return res.json(); })
            .subscribe(function (data) {
            var registerToast = _this.toastCtrl.create({
                message: 'Đăng kí thành công !',
                duration: 3000,
                position: 'top'
            });
            registerToast.onDidDismiss(function () {
                var confirm = _this.alertCtrl.create({
                    title: 'Thông báo',
                    message: 'Bạn có muốn đăng nhập bằng tài khoản này ?',
                    buttons: [
                        { text: 'Không',
                            handler: function () {
                                _this.dismiss(false); //ko đăng nhập
                            }
                        },
                        { text: 'Đồng ý',
                            handler: function () {
                                _this.login(_this.email, _this.password);
                            }
                        }
                    ]
                });
                confirm.present();
            });
            registerToast.present();
        }, function (error) {
            var alert = _this.alertCtrl.create({
                title: 'Thông báo',
                subTitle: 'Có lỗi khi đăng kí ! Vui lòng đăng kí lại',
                buttons: ['OK']
            });
            alert.present();
        });
    };
    RegisterModal.prototype.login = function (email, password) {
        var _this = this;
        var url = this.globalVariable.HOST + '/api/login?email=' + email + "&password=" + password + "&type=0";
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
                            _this.dismiss(true); //có đăng nhâpj
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
    return RegisterModal;
}());
RegisterModal = __decorate([
    Component({
        selector: 'modal-register',
        templateUrl: 'modal-register.html',
        providers: [VariableService]
    }),
    __metadata("design:paramtypes", [ViewController, NavParams, ModalController,
        AlertController, ToastController, Http,
        VariableService, DatabaseService])
], RegisterModal);
export { RegisterModal };
//# sourceMappingURL=modal-register.js.map