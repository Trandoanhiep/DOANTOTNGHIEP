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
//page
import { PracticeListenPage } from '../practice-listen/practice-listen';
import { PracticeSpeakPage } from '../practice-speak/practice-speak';
import { PracticeWritePage } from '../practice-write/practice-write';
import { PracticeFlashcardPage } from '../practice-flashcard/practice-flashcard';
var PracticePage = (function () {
    function PracticePage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.courseId = navParams.get('courseId');
        this.listPractice = [
            {
                name: "Luyện nghe",
                image: "luyen-nghe.png",
                des: "Luyện tập kĩ năng nghe bằng cách nghe và chọn đáp án đúng",
                page: PracticeListenPage
            },
            {
                name: "Luyện phát âm",
                image: "luyen-noi.png",
                des: "Luyện tập kĩ năng nói bằng cách phát âm từ theo từ cho sẵn",
                page: PracticeSpeakPage
            },
            {
                name: "Luyện viết",
                image: "luyen-viet.png",
                des: "Luyện tập kĩ năng viết . Hãy sắp xếp các từ theo thứ tự đúng",
                page: PracticeWritePage
            },
            {
                name: "Flashcard",
                image: "flashcard.png",
                des: "Luyện tập với các thẻ flashcard",
                page: PracticeFlashcardPage
            }
        ];
    }
    PracticePage.prototype.selectPractice = function (page) {
        this.navCtrl.push(page, { courseId: this.courseId });
    };
    return PracticePage;
}());
PracticePage = __decorate([
    Component({
        selector: 'page-practice',
        templateUrl: 'practice.html'
    }),
    __metadata("design:paramtypes", [NavController, NavParams])
], PracticePage);
export { PracticePage };
//# sourceMappingURL=practice.js.map