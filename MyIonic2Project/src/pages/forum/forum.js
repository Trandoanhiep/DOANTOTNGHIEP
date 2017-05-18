var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { DetailPostPage } from '../detail-post/detail-post';
import { LoginModal } from '../modal-login/modal-login';
import { DatabaseService } from '../../providers/database-service';
import { ForumService } from '../../providers/forum-service';
import { Emitter } from '../../providers/rootscope-service';
var ForumPage = (function () {
    function ForumPage(navCtrl, navParams, modalCtrl, databaseService, forumService, zone, scope) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.databaseService = databaseService;
        this.forumService = forumService;
        this.zone = zone;
        this.scope = scope;
        this.isLogined = false;
        this.listPosts = [];
        this.totalComments = 0;
        this.currentUser = null;
        this.userPost = { title: '', content: '', idUser: '', createAt: '' };
        this.limit = 10;
        this.currentUser = navParams.get('currentUser');
        if (this.currentUser) {
            this.isLogined = true;
            this.getData(this.limit);
        }
    }
    ForumPage.prototype.getData = function (limit) {
        var _this = this;
        this.forumService.getAllPosts(limit).subscribe(function (data) {
            _this.listPosts = [];
            for (var i = 0; i < data.length; ++i) {
                var post = {
                    id: data[i].id,
                    createAt: _this.convertTime(new Date(data[i].createdon)),
                    userName: data[i].fullname,
                    userId: data[i].userid,
                    title: data[i].title,
                    content: data[i].content,
                    colorUser: _this.randomColor()
                };
                _this.listPosts.push(post);
            }
        });
    };
    ForumPage.prototype.login = function () {
        var _this = this;
        var loginModal = this.modalCtrl.create(LoginModal);
        loginModal.present();
        loginModal.onDidDismiss(function (data) {
            _this.databaseService.getUser()
                .then(function (data) {
                if (data.rows.length > 0) {
                    _this.currentUser = data.rows.item(0);
                    _this.isLogined = true;
                    _this.scope.emit('loginSuccess', _this.currentUser);
                }
                else {
                    _this.currentUser = null;
                }
            });
        });
    };
    ForumPage.prototype.convertTime = function (date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        return day + "/" + month + "/" + year + "  " + hours + ':' + minutes + ' ' + ampm;
    };
    ForumPage.prototype.randomColor = function () {
        var arr = ["#ff9900", "#BB0000", "#222222", "#00CC66", "#006666", "#333399", "#663300"];
        return arr[Math.floor(Math.random() * arr.length)];
    };
    ForumPage.prototype.post = function () {
        var _this = this;
        if (this.userPost.title == '' && this.userPost.content == '') {
        }
        else {
            this.userPost.idUser = this.currentUser.id;
            this.forumService.userPost(this.userPost)
                .subscribe(function (data) {
                var post = {
                    id: data.id,
                    createAt: _this.convertTime(new Date(data.createdon)),
                    userName: data.fullname,
                    userId: data.userid,
                    title: data.title,
                    content: data.content,
                    colorUser: _this.randomColor()
                };
                _this.listPosts.unshift(post);
                _this.userPost = { title: '', content: '', idUser: '', createAt: '' };
            });
        }
    };
    ForumPage.prototype.selectPost = function (post) {
        this.navCtrl.push(DetailPostPage, { post: post, currentUser: this.currentUser });
    };
    ForumPage.prototype.viewMore = function () {
        this.limit += 10;
        this.getData(this.limit);
    };
    return ForumPage;
}());
ForumPage = __decorate([
    Component({
        selector: 'page-forum',
        templateUrl: 'forum.html',
        providers: [ForumService]
    }),
    __metadata("design:paramtypes", [NavController, NavParams, ModalController,
        DatabaseService, ForumService, NgZone, Emitter])
], ForumPage);
export { ForumPage };
//# sourceMappingURL=forum.js.map