var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NgModule } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { VariableService } from './variable-service';
var ForumService = (function () {
    function ForumService(http, globalVariable) {
        this.http = http;
        this.globalVariable = globalVariable;
    }
    ForumService.prototype.userPost = function (post) {
        var url = this.globalVariable.HOST + '/api/user-post?title=' + post.title + "&content=" + post.content +
            "&userid=" + post.idUser;
        return this.http.get(url).map(function (res) { return res.json(); });
    };
    ForumService.prototype.userComment = function (comment) {
        var url = this.globalVariable.HOST + "/api/user-comment?content=" + comment.content +
            "&postid=" + comment.idPost + "&userid=" + comment.idUser;
        return this.http.get(url).map(function (res) { return res.json(); });
    };
    ForumService.prototype.getAllPosts = function (limit) {
        var url = this.globalVariable.HOST + "/api/get-all-posts?limit=" + limit;
        return this.http.get(url).map(function (res) { return res.json(); });
    };
    ForumService.prototype.getAllComments = function (postid, limit) {
        var url = this.globalVariable.HOST + "/api/get-all-comments?postid=" + postid + "&limit=" + limit;
        return this.http.get(url).map(function (res) { return res.json(); });
    };
    return ForumService;
}());
ForumService = __decorate([
    NgModule({
        providers: [VariableService]
    }),
    Injectable(),
    __metadata("design:paramtypes", [Http, VariableService])
], ForumService);
export { ForumService };
//# sourceMappingURL=forum-service.js.map