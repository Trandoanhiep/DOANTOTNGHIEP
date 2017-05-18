import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TestListeningPage } from '../test-listening/test-listening';
import { TestReadingPage } from '../test-reading/test-reading';

import {DatabaseService} from '../../providers/database-service';
import {ToeicService} from '../../providers/toeic-service';

/*
  Generated class for the TestDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-test-detail',
  templateUrl: 'test-detail.html',
  providers: [ToeicService]
})
export class TestDetailPage {
	  RL:any;
    test:any;
    isShowResult:boolean = false;
    detailScore:string = 'listening';

    trueIcon:string  = './assets/icon/true-icon.png';
    falseIcon:string = './assets/icon/false-icon.png';

    result:any = null;
  	constructor(public navCtrl: NavController, public navParams: NavParams,
    public toeicService: ToeicService,public databaseService: DatabaseService) {
        this.test = navParams.get('test');
    		this.RL = [
    		{
      			name:"Phần Listening",
      			image:"md-headset",
      			page: TestListeningPage,
            data: {
                idTest : this.test.idTest,
                part1 : this.test.part1,
                part2 : this.test.part2,
                part3 : this.test.part3,
                part4 : this.test.part4
            }
    		},
    		{
      			name:"Phần Reading",
      			image:"md-create",
      			page:TestReadingPage,
            data: {
                idTest : this.test.idTest,
                part5 : this.test.part5,
                part6 : this.test.part6,
                part7 : this.test.part7
            }
    		}
    		];
  	}

  	selectTest(page, data){
  		  this.navCtrl.push(page, {data : data});
  	}

  	showResult(){
        if(this.isShowResult){
            this.isShowResult = !this.isShowResult;
        }else{
            if(!this.result){
                let result = [];
                this.databaseService.getResultToeic(this.test.idTest)
                .then((data)=>{
                    if(data.rows.length > 0) {
                        for(let i = 0; i < data.rows.length; i++) {
                            result.push(data.rows.item(i));
                        }

                        this.toeicService.calcToeicScore(result).then((data)=>{
                            this.result = data;
                            this.isShowResult = !this.isShowResult;
                            
                        })
                    }
                })
            }else{
                this.isShowResult = !this.isShowResult;
            }
        }
           
  	}

    showDetailScore(type){
        this.detailScore = type;
    }
}
