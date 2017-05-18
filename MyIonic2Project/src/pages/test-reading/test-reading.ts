import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar, AlertController, ToastController} from 'ionic-angular';

import {ToeicService} from '../../providers/toeic-service';
import {DatabaseService} from '../../providers/database-service';

import * as $ from "jquery";


/*
  Generated class for the TestReading page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-test-reading',
  templateUrl: 'test-reading.html',
  providers: [ToeicService]
})
export class TestReadingPage {
    @ViewChild(Navbar) navBar:Navbar;

  	interval:any;
  	time:any = { minute : 75, second : 0 };

    idTest:any;
    idObj:any = {part5: '', part6: '', part7: ''};

    dataPart5:any;
    dataPart6:any;
    dataPart7:any; 

    currentPart:number = 5;

    result:any = [];

  	constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,public toastCtrl: ToastController,
    public toeicService: ToeicService,public databaseService: DatabaseService) {
        this.idTest = navParams.get('data').idTest;
        this.idObj.part5  = navParams.get('data').part5;
        this.idObj.part6  = navParams.get('data').part6;
        this.idObj.part7  = navParams.get('data').part7;

    		this.countTime();

        this.getData();
  	}

    ionViewWillLeave() {
        clearInterval(this.interval);
    }

    ionViewDidLoad() {
        this.navBar.backButtonClick = (e:UIEvent) => {
            let confirm = this.alertCtrl.create({
                title: 'Thông báo',
                message: 'Bài thi chưa được submit . Bạn chắc chắn muốn thoát ?',
                buttons: [
                  {   text: 'Không',
                      handler: () => {
                        
                      }
                  },
                  {  text: 'Đồng ý',
                      handler: () => {
                         this.navCtrl.pop();
                      }
                  }
                ]
          });
          confirm.present();
        };
    }

  	countTime(){
  		this.interval = setInterval(()=>{
  			 
  			if(this.time.second > 0){
  				this.time.second--;
  			}else{
  				this.time.second = 59;
  				this.time.minute--;
  			}

  			if(this.time.minute == 0 && this.time.second == 0){
  				console.log('hết giờ');
  				clearInterval(this.interval);
  			}
  		},1000);
  	}

    getData(){
        this.toeicService.getPartData(this.idTest, this.idObj.part5)
        .subscribe((listQuestion)=>{
            this.dataPart5 = listQuestion;
        })

        this.toeicService.getPartData(this.idTest, this.idObj.part6)
        .subscribe((listQuestion)=>{
            this.dataPart6 = listQuestion;
        })

        this.toeicService.getPartData(this.idTest, this.idObj.part7)
        .subscribe((listQuestion)=>{
            this.dataPart7 = listQuestion
        });
    }

    makeid(length){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

  	selectPart(part){

        if((part - this.currentPart) == 1){
            this.getAnswersOfUser(this.currentPart);

            //reset mọi thứ về ban đầu
            $("page-test-reading .list-tabs .part-" + this.currentPart).addClass("disable");

            this.currentPart = part;

            $("page-test-reading .item-tab").removeClass("active-tab");
            $("page-test-reading .list-tabs .part-" + part).addClass("active-tab");
        }else{
            let toast = this.toastCtrl.create({
                  message: 'Bạn phải làm theo lần lượt từng part !',
                  duration: 3000,
                  position: 'top'
              });

              toast.present();
        } 
	  }

    finishPart(part){
        this.selectPart(++part);
    }

    getAnswersOfUser(part){
      let fromQ,toQ;
      let data = [];
      if(part == 5){
          fromQ = 101;
          toQ = 140;
          data = this.dataPart5;
      }else if(part == 6){
          fromQ = 141;
          toQ = 152;
          for (let i = 0; i < this.dataPart6.length; ++i) 
            for (let j = 0; j < this.dataPart6[i].listquestion.length; ++j) 
              data.push(this.dataPart6[i].listquestion[j]);
      }else if(part == 7){
          fromQ = 153;
          toQ = 200;
          for (let i = 0; i < this.dataPart7.length; ++i) 
            for (let j = 0; j < this.dataPart7[i].listquestion.length; ++j) 
              data.push(this.dataPart7[i].listquestion[j]);
      }
      for (let i = fromQ; i <= toQ; ++i) {
        let answer = {
            id : this.makeid(32),
            idTest : this.idTest,
            idQuestion : i,
            myAnswer : $("input[name='answers-" + i + "']:checked").val(),
            correctAnswer : data[i-fromQ].answerCorrect
        }
        this.result.push(answer);
      }
      console.log(this.result);
  }

    submit(){
      this.databaseService.saveResultToeic(this.idTest, this.result)
      .then((data)=>{
          if(data){
              this.navCtrl.pop();
          }else{
            console.log("có lỗi khi save")
          }
      });
      
    }

}
