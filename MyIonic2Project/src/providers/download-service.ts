import { Injectable,NgModule, NgZone } from '@angular/core';
import { Http , Response} from '@angular/http';
import 'rxjs/add/operator/map';

import {LoadingController} from 'ionic-angular';

import { Transfer, Zip, File} from 'ionic-native';

import {VariableService} from './variable-service';
import {DatabaseService} from './database-service';

declare var cordova: any;
declare var window:any;

@NgModule({
    providers: [VariableService]
})

@Injectable()
export class DownloadService {
    fileTransfer:Transfer;
    loadingDownload:any;
    loadingUnzip:any;
    constructor(public http: Http, public loadingCtrl: LoadingController,public globalVariable: VariableService,public zone: NgZone) {
        console.log('đã load download service');
        this.fileTransfer = new Transfer();

        this.loadingDownload = this.loadingCtrl.create({
            content: 'Đang tải dữ liệu  0%'
        });

        this.loadingUnzip = this.loadingCtrl.create({
            content: 'Đang cài đặt dữ liệu  0%'
        });

    }

    downloadCourse(id, loadingDownload, loadingUnzip) {
        this.loadingDownload = loadingDownload;
        this.loadingUnzip = loadingUnzip;
        this.loadingDownload.present();
        // id = 'test';
        let srcUrlDownload = this.globalVariable.HOST + "/data/" + id + ".zip";
        let destUrlDownload = cordova.file.dataDirectory + id +'.zip';

        let srcUnzip = destUrlDownload;
        let destUnzip = cordova.file.dataDirectory + "data/"; 

        return  new Promise<any>((resolve, reject) => {
                    this.fileTransfer.onProgress(this.progressDownload.bind(this));

                    this.fileTransfer.download(srcUrlDownload, destUrlDownload)
                    .then((entry) => {
                        console.log('download complete: ' + entry.toURL());
                        this.loadingDownload.dismiss();
                        this.loadingUnzip.present();
                        this.unzip(srcUnzip,destUnzip, this.progressUnzip.bind(this))
                        .then((result) => {
                            this.removeZipFile(destUrlDownload);
                            if(result === 0){
                                this.loadingUnzip.setContent('Hoàn tất việc cài đặt 100%');
                                this.zone.run(() => {}) ;

                                setTimeout(()=>{
                                    this.loadingUnzip.dismiss();
                                    resolve(result);
                                },2000);
                                    
                            } 
                            else if(result === -1){
                                reject(result);
                            }   
                        });
                    }, (error) => {
                        
                    });
                });
    }

    downloadImageOfCourse(courseId){

        let srcUrlDownload  = this.globalVariable.HOST   + "/data/" + courseId + ".jpg";
        let destUrlDownload = cordova.file.dataDirectory + "data/"  + courseId + ".jpg";

        return  new Promise<any>((resolve, reject) => {

                    this.fileTransfer.download(srcUrlDownload, destUrlDownload)
                    .then((entry) => {
                        console.log('download img thành công');
                        resolve('download img thành công');
                    }, (error) => {
                        reject('fail');
                    });
                });
    }

    downloadToeicTest(id, loadingDownload, loadingUnzip){
        this.loadingDownload = loadingDownload;
        this.loadingUnzip = loadingUnzip;
        this.loadingDownload.present(); 

        let srcUrlDownload = this.globalVariable.HOST + "/toeic/" + id + ".zip";
        console.log(srcUrlDownload);
        let destUrlDownload = cordova.file.dataDirectory + id +'.zip';

        let srcUnzip = destUrlDownload;
        let destUnzip = cordova.file.dataDirectory + "toeic/"; 

        return  new Promise<any>((resolve, reject) => {
                    this.fileTransfer.onProgress(this.progressDownload.bind(this));

                    this.fileTransfer.download(srcUrlDownload, destUrlDownload)
                    .then((entry) => {
                        console.log('download complete: ' + entry.toURL());
                        this.loadingDownload.dismiss();
                        this.loadingUnzip.present();
                        this.unzip(srcUnzip,destUnzip, this.progressUnzip.bind(this))
                        .then((result) => {
                            this.removeZipFile(destUrlDownload);
                            if(result === 0){
                                this.loadingUnzip.setContent('Hoàn tất việc cài đặt');
                                this.zone.run(() => {}) ;

                                setTimeout(()=>{
                                    this.loadingUnzip.dismiss();
                                    resolve(result);
                                },1000);
                                    
                            } 
                            else if(result === -1){
                                reject(result);
                            }
                                
                        });
                    }, (error) => {
                        
                    });
                });
    }

    test(){
        console.log("test download")
    }

    unzip(sourceZip, destUrl, callback){
      return  Zip.unzip(sourceZip, destUrl, callback);
    }

    removeZipFile(url){       
        window.resolveLocalFileSystemURL(url, 
         (entry) => {
            entry.remove(()=>{console.log('xóa file zip thành công');}, ()=>{});
        }, () => {});
    }

    progressUnzip(progressUnZip){
        let percent = Math.round((progressUnZip.loaded / progressUnZip.total) * 100);
        console.log('unzipping : ' + percent);
        if(percent == 100 ) percent = 99;
        this.loadingUnzip.setContent('Đang cài đặt dữ liệu  ' + percent +'%');
        this.zone.run(() => {}) ;  
    }

    progressDownload(progressDownload){
        let percent = Math.round((progressDownload.loaded / progressDownload.total) * 100);
        console.log('downloading : ' + percent);
        if(percent == 100 ) percent = 99;

        this.loadingDownload.setContent('Đang tải dữ liệu  ' + percent +'%');
        this.zone.run(() => {}) ;
    }


}