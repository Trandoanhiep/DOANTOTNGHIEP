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
var CourseService = (function () {
    function CourseService(http, globalletiable) {
        this.http = http;
        this.globalletiable = globalletiable;
        this.generateListenPractice = function (list, callback) {
            var length = list.length;
            var listQuestions = [];
            for (var i = 0; i < length; i++) {
                var answerList = [];
                var word = list[i];
                answerList.push(word);
                while (answerList.length < 4) {
                    var random = list[Math.floor(Math.random() * list.length)];
                    var found = false;
                    for (var j = 0; j < answerList.length; j++) {
                        if (answerList[j].word == random.word) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        answerList.push(random);
                    }
                }
                listQuestions.push({ correctAnswer: word, answerList: this.shuffleArray(answerList) });
            }
            callback(listQuestions);
        };
        this.generateWritePractice = function (list, callback) {
            var length = list.length;
            var listQuestions = [];
            for (var i = 0; i < length; i++) {
                var word = list[i];
                var str = word.word.trim();
                var answerList = [];
                for (var j = 0; j < str.length; ++j) {
                    answerList.push(str[j]);
                }
                listQuestions.push({ correctAnswer: word, answerList: this.shuffleArray(answerList) });
            }
            callback(listQuestions);
        };
        this.generateFlashcardPractice = function (list) {
            var length = list.length;
            var listFlashcard = [];
            for (var i = 0; i < length; i++) {
                var word = list[i];
                var flashcard = {
                    id: word.id,
                    audio: word.audio,
                    front: {
                        word: word.word
                    },
                    back: {
                        word: word.word,
                        phonetic: word.phonetic,
                        mean: word.mean,
                        example: word.example,
                        image: word.image
                    }
                };
                listFlashcard.push(flashcard);
            }
            return listFlashcard;
        };
    }
    CourseService.prototype.getUrlImageCourse = function (courseID) {
        var url = cordova.file.dataDirectory + "data/" + courseID + ".jpg";
        return url;
    };
    CourseService.prototype.getUrlImageLesson = function (courseID, lessonID) {
        var url = cordova.file.dataDirectory + "data/" + courseID + "/images/lessons/" + lessonID + ".jpg";
        return url;
    };
    CourseService.prototype.getUrlImageWord = function (courseID, wordID) {
        var url = cordova.file.dataDirectory + "data/" + courseID + "/images/words/" + wordID + ".jpg";
        return url;
    };
    CourseService.prototype.getUrlAudioWord = function (courseID, wordID) {
        var url = cordova.file.dataDirectory + "data/" + courseID + "/audios/" + wordID + ".mp3";
        return url;
    };
    CourseService.prototype.shuffleArray = function (array) {
        var newArray = JSON.parse(JSON.stringify(array));
        var m = newArray.length, t, i;
        // While there remain elements to shuffle
        while (m) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);
            // And swap it with the current element.
            t = newArray[m];
            newArray[m] = newArray[i];
            newArray[i] = t;
        }
        return newArray;
    };
    CourseService.prototype.getSimilarityOfString = function (s1, s2) {
        s1 = s1.toLowerCase().trim();
        s2 = s2.toLowerCase().trim();
        var match = 2, missMatch = -1;
        var gapPenalty = -1;
        //các hàm
        var reverse = function (str) {
            var s = '';
            for (var i_1 = str.length - 1; i_1 >= 0; i_1--)
                s += str[i_1];
            return s;
        };
        var valueF = function (array) {
            var size = array.length;
            var val = array[0], maxIndex = 0, indexValue = 0;
            var x = {};
            //tìm giá trị max
            for (var i_2 = 0; i_2 < size; i_2++) {
                if (array[i_2] > val)
                    val = array[i_2];
            }
            ;
            return val;
        };
        var maxInArray = function (array) {
            var maxInd = array[0][0].value;
            var i_max = 0, j_max = 0;
            for (var i_3 = 0; i_3 < array.length; i_3++) {
                for (var j_1 = 0; j_1 < array[i_3].length; j_1++) {
                    if (array[i_3][j_1].value >= maxInd)
                        maxInd = array[i_3][j_1].value;
                    {
                        i_max = i_3;
                        j_max = j_1;
                    }
                }
            }
            for (var i_4 = 0; i_4 < array.length; i_4++) {
                for (var j_2 = 0; j_2 < array[i_4].length; j_2++) {
                    if (array[i_4][j_2].value == maxInd) {
                        i_max = i_4;
                        j_max = j_2;
                    }
                }
            }
            return { i: i_max, j: j_max };
        };
        var arrayS = function (a, b) {
            var S = new Array;
            for (var i_5 = 0; i_5 < b.length; i_5++) {
                S[i_5] = [];
                for (var j_3 = 0; j_3 < a.length; j_3++) {
                    if (b.charAt(i_5) == a.charAt(j_3))
                        S[i_5][j_3] = match;
                    else
                        S[i_5][j_3] = missMatch;
                }
            }
            return S;
        };
        var arrayF = function (a, b) {
            var S = arrayS(a, b);
            var F = new Array;
            for (var i_6 = 0; i_6 < (b.length + 1); i_6++) {
                F[i_6] = [];
                for (var j_4 = 0; j_4 < (a.length + 1); j_4++) {
                    if (i_6 == 0 || j_4 == 0)
                        F[i_6][j_4] = { value: 0 };
                    else {
                        var indexValue = {};
                        var arr = [0,
                            F[i_6 - 1][j_4 - 1].value + S[i_6 - 1][j_4 - 1],
                            F[i_6][j_4 - 1].value + gapPenalty,
                            F[i_6 - 1][j_4].value + gapPenalty
                        ];
                        var x = valueF(arr);
                        if (x == arr[1])
                            indexValue = { i: i_6 - 1, j: j_4 - 1 };
                        else if (x == arr[2])
                            indexValue = { i: i_6, j: j_4 - 1 };
                        else if (x == arr[3])
                            indexValue = { i: i_6 - 1, j: j_4 };
                        else if (x == arr[0])
                            indexValue = {};
                        F[i_6][j_4] = {
                            value: x,
                            index: indexValue
                        };
                    }
                }
            }
            return F;
        };
        //bắt đầu xử lí
        if (s1 == null)
            s1 = '';
        if (s2 == null)
            s2 = '';
        var ss1 = '', ss2 = '';
        var F = arrayF(s1, s2);
        var i = maxInArray(F).i;
        var j = maxInArray(F).j;
        while (F[i][j].value != 0) {
            if (F[i][j].index.i == (i - 1) && F[i][j].index.j == (j - 1)) {
                ss2 += s2[i - 1];
                ss1 += s1[j - 1];
                --i;
                --j;
            }
            else if (F[i][j].index.i == (i) && F[i][j].index.j == (j - 1)) {
                ss2 += '_';
                ss1 += s1[j - 1];
                --j;
            }
            else if (F[i][j].index.i == (i - 1) && F[i][j].index.j == (j)) {
                ss2 += s2[i - 1];
                ss1 += '_';
                --i;
            }
        }
        ss1 = reverse(ss1);
        ss2 = reverse(ss2);
        var distance = 0;
        for (var i_7 = 0; i_7 < ss1.length; i_7++) {
            if (ss1[i_7] == ss2[i_7])
                distance++;
        }
        var maxLength = (s1.length > s2.length) ? s1.length : s2.length;
        var percent = (distance * 100.0) / maxLength;
        return percent;
        // if(percent == 100){
        //     return 5;
        // }else if(83 <= percent && percent <= 99){
        //     return 5;
        // }else if(67 <= percent && percent <= 82){
        //     return 4;
        // }else if(40 <= percent && percent <= 66){
        //     return 3;
        // }else if(1 <= percent && percent <= 39){
        //     return 2;
        // }else{
        //     return 1;
        // }
    };
    return CourseService;
}());
CourseService = __decorate([
    NgModule({
        providers: [VariableService]
    }),
    Injectable(),
    __metadata("design:paramtypes", [Http, VariableService])
], CourseService);
export { CourseService };
//# sourceMappingURL=course-service.js.map