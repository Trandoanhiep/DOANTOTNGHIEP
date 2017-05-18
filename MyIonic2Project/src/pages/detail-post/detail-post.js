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
import { ForumService } from '../../providers/forum-service';
var DetailPostPage = (function () {
    function DetailPostPage(navCtrl, navParams, forumService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.forumService = forumService;
        this.currentUser = null;
        this.userComment = { content: '', idUser: '', idPost: '' };
        this.listComments = [];
        this.limit = 10;
        this.post = navParams.get('post');
        this.currentUser = navParams.get('currentUser');
        this.getData(this.post.id, this.limit);
    }
    DetailPostPage.prototype.getData = function (postid, limit) {
        var _this = this;
        this.forumService.getAllComments(postid, limit).subscribe(function (data) {
            _this.listComments = [];
            for (var i = 0; i < data.length; ++i) {
                var comment = {
                    id: data[i].id,
                    userName: data[i].fullname,
                    userId: data[i].userid,
                    content: data[i].content
                };
                _this.listComments.push(comment);
            }
        });
    };
    DetailPostPage.prototype.comment = function () {
        var _this = this;
        if (this.userComment.content == '') {
        }
        else {
            this.userComment.idUser = this.currentUser.id;
            this.userComment.idPost = this.post.id;
            this.forumService.userComment(this.userComment)
                .subscribe(function (data) {
                var comment = {
                    id: data.id,
                    userName: data.fullname,
                    userId: data.userid,
                    content: data.content
                };
                _this.listComments.push(comment);
                _this.userComment = { content: '', idUser: '', idPost: '' };
            });
        }
    };
    DetailPostPage.prototype.viewMore = function () {
        this.limit += 10;
        this.getData(this.post.id, this.limit);
    };
    return DetailPostPage;
}());
DetailPostPage = __decorate([
    Component({
        selector: 'page-detail-post',
        templateUrl: 'detail-post.html',
        providers: [ForumService]
    }),
    __metadata("design:paramtypes", [NavController, NavParams, ForumService])
], DetailPostPage);
export { DetailPostPage };
//# sourceMappingURL=detail-post.js.map