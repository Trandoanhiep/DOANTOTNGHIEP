import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { TestDetailPage } from '../test-detail/test-detail';

import { Facebook} from 'ionic-native';

import {ToeicService} from '../../providers/toeic-service';
import {DatabaseService} from '../../providers/database-service';
import {DownloadService} from '../../providers/download-service';

@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
  providers: [ToeicService]
})
export class TestPage {
  	params:any;
  	userObj:any;
  	FB_APP_ID: number = 172914093182785;

    listToeicTest:any = [];



   	constructor(public navCtrl: NavController,public navParams: NavParams,public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    public toeicService: ToeicService,public databaseService:DatabaseService ,public downloadService: DownloadService  ) {
   	// 	this.userObj = {
    // 			name: "",
    // 			gender: "",
    // 			picture: ""
  		// };
   	// 	Facebook.browserInit(this.FB_APP_ID, "v2.5");

       this.databaseService.getAllToeicTests()
       .then((data)=>{
            if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                    this.listToeicTest.push(data.rows.item(i));
                }
                console.log(this.listToeicTest);
            }
       });
    }


  	login(){
  		let permissions = new Array();
    	permissions = ["public_profile"];

    	Facebook.login(permissions).then((response) => {
      		let userId = response.authResponse.userID;
      		let params = new Array();

      		//Getting name and gender properties
      		Facebook.api("/me?fields=name,gender", params).then( (user) => {
        		user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        		//now we have the users info, let's save it in the NativeStorage
        		this.userObj = {
							name: user.name,
							gender: user.gender,
							picture: user.picture
						};
      		});
    	}, 
    	(error) => {
      		console.log(error);
    	});
  	}

    selectToeicTest(test){    
        if(test.downloaded == 1){
            let listPart = test.idTest.split("-");
            let obj = {
                idTest : test.idTest,
                reading : 0,
                listening : 0,
                finished : 0,
                part1 : listPart[0],
                part2 : listPart[1],
                part3 : listPart[2],
                part4 : listPart[3],
                part5 : listPart[4],
                part6 : listPart[5],
                part7 : listPart[6],
              }
            this.navCtrl.push(TestDetailPage, {test : obj});
        }else{

            

            let confirm = this.alertCtrl.create({
                title: 'Thông báo',
                message: 'Bạn cần tải dữ liệu để có thể làm bài thi ?',
                buttons: [
                  {   text: 'Không',
                      handler: () => {

                      }
                  },
                  {  text: 'Đồng ý',
                      handler: () => {
                          let loadingDownload = this.loadingCtrl.create({
                              content: 'Đang tải dữ liệu  0%'
                          });
                          let loadingUnzip = this.loadingCtrl.create({
                                content: 'Đang cài đặt dữ liệu  0%'
                            });
                          this.downloadService.downloadToeicTest(test.idTest,  loadingDownload, loadingUnzip)
                          .then((result) =>{
                              if(result === 0){
                                  console.log('Unzip SUCCESS');
                                  test.downloaded = 1; 
                                  this.databaseService.updateTest(test).then(()=>{
                                      for (let i = 0; i < this.listToeicTest.length; ++i) {
                                          if(this.listToeicTest[i].idTest == test.idTest) {
                                              console.log('update test SUCCESS');
                                              this.listToeicTest[i].downloaded = 1;break;
                                          }
                                      }
                                  });
                              } 
                          },
                          (error) => {
                              console.log('Lỗi giải nén');
                          });
                      }
                  }
                ]
            });
            confirm.present();
        }   
    }
}
