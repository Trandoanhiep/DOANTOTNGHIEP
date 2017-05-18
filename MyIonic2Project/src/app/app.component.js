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
import { Platform, MenuController, Nav, ModalController, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
//modal
import { LoginModal } from '../pages/modal-login/modal-login';
import { RegisterModal } from '../pages/modal-register/modal-register';
//page
import { CoursesPage } from '../pages/courses/courses';
import { TestPage } from '../pages/test/test';
import { ForumPage } from '../pages/forum/forum';
//service
import { VariableService } from './../providers/variable-service';
import { DatabaseService } from './../providers/database-service';
import { Emitter } from './../providers/rootscope-service';
var MyApp = (function () {
    function MyApp(platform, menu, modalCtrl, alertCtrl, databaseService, scope) {
        var _this = this;
        this.platform = platform;
        this.menu = menu;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.databaseService = databaseService;
        this.scope = scope;
        this.currentUser = null;
        // set our app's pages
        this.pages = [
            { title: 'Hỏi & Đáp', component: ForumPage, icon: 'ios-contacts' },
            { title: 'Thi thử Toeic', component: TestPage, icon: 'ios-create' },
            { title: 'Cài đặt', component: TestPage, icon: 'ios-settings' }
        ];
        // setTimeout(()=>{
        // },1000); 
        this.scope.on('initDatabaseSuccess')
            .subscribe(function (data) {
            _this.databaseService.getUser()
                .then(function (data) {
                if (data.rows.length > 0) {
                    _this.currentUser = data.rows.item(0);
                    console.log(_this.currentUser);
                }
                else {
                    _this.currentUser = null;
                }
            }, function (err) {
                console.error('Lỗi get user: ', err);
            });
            _this.rootPage = CoursesPage;
        });
        this.platform.registerBackButtonAction(function () {
        });
        this.scope.on('loginSuccess')
            .subscribe(function (user) {
            _this.currentUser = user;
            console.log(user);
        });
    }
    MyApp.prototype.menuOpenedEvent = function () {
        var _this = this;
        this.databaseService.getUser()
            .then(function (data) {
            if (data.rows.length > 0) {
                _this.currentUser = data.rows.item(0);
            }
            else {
                _this.currentUser = null;
            }
        }, function (err) {
            console.error('Lỗi get lessons: ', err);
        });
    };
    MyApp.prototype.initializeApp = function () {
        this.platform.ready().then(function () {
            StatusBar.styleDefault();
            Splashscreen.hide();
        });
    };
    MyApp.prototype.showLoginModal = function () {
        var _this = this;
        var loginModal = this.modalCtrl.create(LoginModal);
        loginModal.present();
        loginModal.onDidDismiss(function (data) {
            _this.databaseService.getUser()
                .then(function (data) {
                if (data.rows.length > 0) {
                    _this.currentUser = data.rows.item(0);
                }
                else {
                    _this.currentUser = null;
                }
            });
        });
    };
    MyApp.prototype.showRegisterModal = function () {
        var _this = this;
        var registerModal = this.modalCtrl.create(RegisterModal);
        registerModal.present();
        registerModal.onDidDismiss(function (isLogin) {
            if (isLogin) {
                _this.databaseService.getUser()
                    .then(function (data) {
                    if (data.rows.length > 0) {
                        _this.currentUser = data.rows.item(0);
                    }
                    else {
                        _this.currentUser = null;
                    }
                });
            }
        });
    };
    MyApp.prototype.logout = function () {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: 'Thông báo',
            message: 'Bạn có muốn đăng xuất tài khoản này ?',
            buttons: [
                { text: 'Không',
                    handler: function () {
                    }
                },
                { text: 'Đồng ý',
                    handler: function () {
                        _this.databaseService.deleteUser().then(function () {
                            _this.currentUser = null;
                        });
                    }
                }
            ]
        });
        confirm.present();
    };
    MyApp.prototype.openPage = function (page) {
        // close the menu when clicking a link from the menu
        this.menu.close();
        // navigate to the new page if it is not the current page
        // this.nav.setRoot(page.component);
        this.nav.push(page.component, { currentUser: this.currentUser });
    };
    return MyApp;
}());
__decorate([
    ViewChild(Nav),
    __metadata("design:type", Nav)
], MyApp.prototype, "nav", void 0);
MyApp = __decorate([
    Component({
        templateUrl: 'app.html',
        providers: [VariableService]
    }),
    __metadata("design:paramtypes", [Platform, MenuController, ModalController,
        AlertController, DatabaseService, Emitter])
], MyApp);
export { MyApp };
//# sourceMappingURL=app.component.js.map