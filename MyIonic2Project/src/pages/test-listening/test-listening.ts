import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, Navbar, AlertController, ToastController } from 'ionic-angular';

import { MediaPlugin } from 'ionic-native';

import {ToeicService} from '../../providers/toeic-service';
import {DatabaseService} from '../../providers/database-service';

import * as $ from "jquery";


@Component({
  selector: 'page-test-listening',
  templateUrl: 'test-listening.html',
  providers: [ToeicService]
})

export class TestListeningPage {
    @ViewChild(Navbar) navBar:Navbar;
    timePlayAudio:number = 0;

  	currentPart:number = 1;
  	iconAudio:string = 'play';
    file:any = null;

  	idObj:any = {part1: '', part2: '', part3: '', part4: ''};

  	dataPart1:any = {data : [], audio : ''};
  	dataPart2:any = {data : [], audio : ''};
  	dataPart3:any = {data : [], audio : ''};
  	dataPart4:any = {data : [], audio : ''};

  	result:any = [];
  	idTest:any;

  	interval:any;
  	time:any = { minute : 45, second : 0 };
  	constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,public toastCtrl: ToastController,  public zone: NgZone,
    public toeicService: ToeicService, public databaseService: DatabaseService) {
    		this.idTest = navParams.get('data').idTest;
    		this.idObj.part1  = navParams.get('data').part1;
    		this.idObj.part2  = navParams.get('data').part2;
    		this.idObj.part3  = navParams.get('data').part3;
    		this.idObj.part4  = navParams.get('data').part4;

    		this.getData();

    		this.countTime();
  	}

    ionViewWillLeave() {
        clearInterval(this.interval);
        if(this.file != null) this.file.release();
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

  	getData(){
    		this.toeicService.getPartData(this.idTest, this.idObj.part1)
    		.subscribe((listQuestion)=>{
      			for (let i = 0; i < listQuestion.length; ++i) {
      				listQuestion[i].image = this.toeicService.getImagePart1(this.idTest, this.idObj.part1, listQuestion[i].idQuestion);
      			}
      			this.dataPart1 = {
      				data : listQuestion,
      				audio : this.toeicService.getAudioListening(this.idTest, this.idObj.part1)
      			}
    		})

    		this.toeicService.getPartData(this.idTest, this.idObj.part2)
    		.subscribe((listQuestion)=>{
      			this.dataPart2 = {
      				data : listQuestion,
      				audio : this.toeicService.getAudioListening(this.idTest, this.idObj.part2)
      			}
    		})

    		this.toeicService.getPartData(this.idTest, this.idObj.part3)
    		.subscribe((listQuestion)=>{
      			this.dataPart3 = {
      				data : listQuestion,
      				audio : this.toeicService.getAudioListening(this.idTest, this.idObj.part3)
      			}
    		})

    		this.toeicService.getPartData(this.idTest, this.idObj.part4)
    		.subscribe((listQuestion)=>{
      			this.dataPart4 = {
      				data : listQuestion,
      				audio : this.toeicService.getAudioListening(this.idTest, this.idObj.part4)
      			}
    		});
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
  				console.log('hiển thi alert thông báo xong this.submit()');

  				clearInterval(this.interval);
  			}
  		},1000);
  	}

  	selectPart(part){
        if((part - this.currentPart) == 1){
            //lấy kết quả của part sau đó mới chuyển tab
            this.getAnswersOfUser(this.currentPart);

            //reset mọi thứ về ban đầu
            $("page-test-listening .list-tabs .part-" + this.currentPart).addClass("disable");
            this.iconAudio = 'play';
            if(this.file != null) this.file.release();
            this.timePlayAudio = 0;

            this.currentPart = part;

            $("page-test-listening .item-tab").removeClass("active-tab");
            $("page-test-listening .list-tabs .part-" + part).addClass("active-tab");
        }else{
            let toast = this.toastCtrl.create({
                  message: 'Bạn phải làm theo lần lượt từng part !',
                  duration: 3000,
                  position: 'top'
              });

              toast.present();
        }    
  	}

    playAudio(audioUrrl, part){
        let interval = setInterval(()=>{
              this.timePlayAudio++;
              this.file.getCurrentPosition().then((position) => {
                  let duration = this.file.getDuration();
                  this.timePlayAudio = Math.floor((position*100)/duration);
              });
        },3000*part);

        if(this.iconAudio == 'play'){
              this.iconAudio = 'pause';
              $("page-test-listening .audio-icon-p" + part).addClass("disable");
        }else{
              this.iconAudio = 'play';
        }

        this.file = new MediaPlugin(audioUrrl);
        this.file.init.then(() => {
              console.log('Playback Finished');
              this.iconAudio = 'play';
              clearInterval(interval);
              this.file.release();
        }, (err) => {
              console.log('somthing went wrong! error code: ' + err.code + ' message: ' + err.message);
        });
            
        this.file.play();
    }

    makeid(length){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    getAnswersOfUser(part){
        let fromQ,toQ;
        let data;
        if(part == 1){
            fromQ = 1;
            toQ = 10;
            data = this.dataPart1.data;
        }else if(part == 2){
            fromQ = 11;
            toQ = 40;
            data = this.dataPart2.data;
        }else if(part == 3){
            fromQ = 41;
            toQ = 70;
            data = this.dataPart3.data;
        }else if(part == 4){
            fromQ = 71;
            toQ = 100;
            data = this.dataPart4.data;

            clearInterval(this.interval);
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

  	finishPart(part){
    		this.selectPart(++part);
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
