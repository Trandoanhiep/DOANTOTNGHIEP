var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NgModule, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';
import { Transfer, Zip } from 'ionic-native';
import { VariableService } from './variable-service';
var DownloadService = (function () {
    function DownloadService(http, loadingCtrl, globalVariable, zone) {
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.globalVariable = globalVariable;
        this.zone = zone;
        console.log('đã load download service');
        this.fileTransfer = new Transfer();
        this.loadingDownload = this.loadingCtrl.create({
            content: 'Đang tải dữ liệu  0%'
        });
        this.loadingUnzip = this.loadingCtrl.create({
            content: 'Đang cài đặt dữ liệu  0%'
        });
    }
    DownloadService.prototype.downloadCourse = function (id, loadingDownload, loadingUnzip) {
        var _this = this;
        this.loadingDownload = loadingDownload;
        this.loadingUnzip = loadingUnzip;
        this.loadingDownload.present();
        // id = 'test';
        var srcUrlDownload = this.globalVariable.HOST + "/data/" + id + ".zip";
        var destUrlDownload = cordova.file.dataDirectory + id + '.zip';
        var srcUnzip = destUrlDownload;
        var destUnzip = cordova.file.dataDirectory + "data/";
        return new Promise(function (resolve, reject) {
            _this.fileTransfer.onProgress(_this.progressDownload.bind(_this));
            _this.fileTransfer.download(srcUrlDownload, destUrlDownload)
                .then(function (entry) {
                console.log('download complete: ' + entry.toURL());
                _this.loadingDownload.dismiss();
                _this.loadingUnzip.present();
                _this.unzip(srcUnzip, destUnzip, _this.progressUnzip.bind(_this))
                    .then(function (result) {
                    _this.removeZipFile(destUrlDownload);
                    if (result === 0) {
                        _this.loadingUnzip.setContent('Hoàn tất việc cài đặt 100%');
                        _this.zone.run(function () { });
                        setTimeout(function () {
                            _this.loadingUnzip.dismiss();
                            resolve(result);
                        }, 2000);
                    }
                    else if (result === -1) {
                        reject(result);
                    }
                });
            }, function (error) {
            });
        });
    };
    DownloadService.prototype.downloadImageOfCourse = function (courseId) {
        var _this = this;
        var srcUrlDownload = this.globalVariable.HOST + "/data/" + courseId + ".jpg";
        var destUrlDownload = cordova.file.dataDirectory + "data/" + courseId + ".jpg";
        return new Promise(function (resolve, reject) {
            _this.fileTransfer.download(srcUrlDownload, destUrlDownload)
                .then(function (entry) {
                console.log('download img thành công');
                resolve('download img thành công');
            }, function (error) {
                reject('fail');
            });
        });
    };
    DownloadService.prototype.downloadToeicTest = function (id, loadingDownload, loadingUnzip) {
        var _this = this;
        this.loadingDownload = loadingDownload;
        this.loadingUnzip = loadingUnzip;
        this.loadingDownload.present();
        var srcUrlDownload = this.globalVariable.HOST + "/toeic/" + id + ".zip";
        console.log(srcUrlDownload);
        var destUrlDownload = cordova.file.dataDirectory + id + '.zip';
        var srcUnzip = destUrlDownload;
        var destUnzip = cordova.file.dataDirectory + "toeic/";
        return new Promise(function (resolve, reject) {
            _this.fileTransfer.onProgress(_this.progressDownload.bind(_this));
            _this.fileTransfer.download(srcUrlDownload, destUrlDownload)
                .then(function (entry) {
                console.log('download complete: ' + entry.toURL());
                _this.loadingDownload.dismiss();
                _this.loadingUnzip.present();
                _this.unzip(srcUnzip, destUnzip, _this.progressUnzip.bind(_this))
                    .then(function (result) {
                    _this.removeZipFile(destUrlDownload);
                    if (result === 0) {
                        _this.loadingUnzip.setContent('Hoàn tất việc cài đặt');
                        _this.zone.run(function () { });
                        setTimeout(function () {
                            _this.loadingUnzip.dismiss();
                            resolve(result);
                        }, 1000);
                    }
                    else if (result === -1) {
                        reject(result);
                    }
                });
            }, function (error) {
            });
        });
    };
    DownloadService.prototype.test = function () {
        console.log("test download");
    };
    DownloadService.prototype.unzip = function (sourceZip, destUrl, callback) {
        return Zip.unzip(sourceZip, destUrl, callback);
    };
    DownloadService.prototype.removeZipFile = function (url) {
        window.resolveLocalFileSystemURL(url, function (entry) {
            entry.remove(function () { console.log('xóa file zip thành công'); }, function () { });
        }, function () { });
    };
    DownloadService.prototype.progressUnzip = function (progressUnZip) {
        var percent = Math.round((progressUnZip.loaded / progressUnZip.total) * 100);
        console.log('unzipping : ' + percent);
        if (percent == 100)
            percent = 99;
        this.loadingUnzip.setContent('Đang cài đặt dữ liệu  ' + percent + '%');
        this.zone.run(function () { });
    };
    DownloadService.prototype.progressDownload = function (progressDownload) {
        var percent = Math.round((progressDownload.loaded / progressDownload.total) * 100);
        console.log('downloading : ' + percent);
        if (percent == 100)
            percent = 99;
        this.loadingDownload.setContent('Đang tải dữ liệu  ' + percent + '%');
        this.zone.run(function () { });
    };
    return DownloadService;
}());
DownloadService = __decorate([
    NgModule({
        providers: [VariableService]
    }),
    Injectable(),
    __metadata("design:paramtypes", [Http, LoadingController, VariableService, NgZone])
], DownloadService);
export { DownloadService };
//# sourceMappingURL=download-service.js.map