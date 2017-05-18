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
import { DatabaseService } from './database-service';
var ToeicService = (function () {
    function ToeicService(http, databaseService) {
        this.http = http;
        this.databaseService = databaseService;
    }
    ToeicService.prototype.loadScoreTable = function () {
        var url = "./assets/calcToeicScore.json";
        return this.http.get(url).map(function (res) { return res.json(); });
    };
    ToeicService.prototype.calcToeicScore = function (result) {
        var _this = this;
        var trueIcon = './assets/icon/true-icon.png';
        var falseIcon = './assets/icon/false-icon.png';
        var obj = {
            listeningScore: 0,
            readingScore: 0,
            part1: [],
            part2: [],
            part3: [],
            part4: [],
            part5: [],
            part6: [],
            part7: []
        };
        var countListening = 0;
        var countReading = 0;
        for (var i = 0; i < result.length; ++i) {
            var r = {
                idQuestion: result[i].id_question,
                class: "",
                icon: ""
            };
            if (parseInt(result[i].id_question) >= 1 && parseInt(result[i].id_question) <= 10) {
                if (result[i].correct_answer == result[i].my_answer) {
                    r.class = 'true';
                    r.icon = trueIcon;
                    countListening++;
                }
                else {
                    r.class = 'false';
                    r.icon = falseIcon;
                }
                obj.part1.push(r);
            }
            else if (parseInt(result[i].id_question) >= 11 && parseInt(result[i].id_question) <= 40) {
                if (result[i].correct_answer == result[i].my_answer) {
                    r.class = 'true';
                    r.icon = trueIcon;
                    countListening++;
                }
                else {
                    r.class = 'false';
                    r.icon = falseIcon;
                }
                obj.part2.push(r);
            }
            else if (parseInt(result[i].id_question) >= 41 && parseInt(result[i].id_question) <= 70) {
                if (result[i].correct_answer == result[i].my_answer) {
                    r.class = 'true';
                    r.icon = trueIcon;
                    countListening++;
                }
                else {
                    r.class = 'false';
                    r.icon = falseIcon;
                }
                obj.part3.push(r);
            }
            else if (parseInt(result[i].id_question) >= 71 && parseInt(result[i].id_question) <= 100) {
                if (result[i].correct_answer == result[i].my_answer) {
                    r.class = 'true';
                    r.icon = trueIcon;
                    countListening++;
                }
                else {
                    r.class = 'false';
                    r.icon = falseIcon;
                }
                obj.part4.push(r);
            }
            else if (parseInt(result[i].id_question) >= 101 && parseInt(result[i].id_question) <= 140) {
                if (result[i].correct_answer == result[i].my_answer) {
                    r.class = 'true';
                    r.icon = trueIcon;
                    countReading++;
                }
                else {
                    r.class = 'false';
                    r.icon = falseIcon;
                }
                obj.part5.push(r);
            }
            else if (parseInt(result[i].id_question) >= 141 && parseInt(result[i].id_question) <= 152) {
                if (result[i].correct_answer == result[i].my_answer) {
                    r.class = 'true';
                    r.icon = trueIcon;
                    countReading++;
                }
                else {
                    r.class = 'false';
                    r.icon = falseIcon;
                }
                obj.part6.push(r);
            }
            else if (parseInt(result[i].id_question) >= 153 && parseInt(result[i].id_question) <= 200) {
                if (result[i].correct_answer == result[i].my_answer) {
                    r.class = 'true';
                    r.icon = trueIcon;
                    countReading++;
                }
                else {
                    r.class = 'false';
                    r.icon = falseIcon;
                }
                obj.part7.push(r);
            }
        }
        return new Promise(function (resolve, reject) {
            _this.loadScoreTable().subscribe(function (data) {
                obj.listeningScore = data.listening[countListening];
                obj.readingScore = data.reading[countReading];
                resolve(obj);
            });
        });
    };
    ToeicService.prototype.getPartData = function (idTest, idPart) {
        var url = cordova.file.dataDirectory + "toeic/" + idTest + "/" + idPart + "/data.json";
        return this.http.get(url).map(function (res) { return res.json(); });
    };
    ToeicService.prototype.getImagePart1 = function (idTest, idPart, id) {
        return cordova.file.dataDirectory + "toeic/" + idTest + "/" + idPart + '/images/' + id + '.png';
    };
    ToeicService.prototype.getAudioListening = function (idTest, idPart) {
        return cordova.file.dataDirectory + "toeic/" + idTest + "/" + idPart + "/" + idPart + ".mp3";
    };
    return ToeicService;
}());
ToeicService = __decorate([
    NgModule({
        providers: [DatabaseService]
    }),
    Injectable(),
    __metadata("design:paramtypes", [Http, DatabaseService])
], ToeicService);
export { ToeicService };
//# sourceMappingURL=toeic-service.js.map