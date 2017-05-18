import { Component} from '@angular/core';
import { ViewController, NavParams, AlertController, ToastController} from 'ionic-angular';

import { MediaPlugin } from 'ionic-native';

import {DatabaseService} from '../../providers/database-service';

import {Word}          from '../../classes/Word';

@Component({
	selector: 'modal-detail-word',
  	templateUrl: 'modal-detail-word.html'
})
export class DetailWordModal {
  	word:Word ;
  	file:MediaPlugin;

  	constructor(private viewCtrl: ViewController,public navParams: NavParams,public alertCtrl: AlertController, public toastCtrl: ToastController,
    public databaseService:DatabaseService) {
		    this.word = this.navParams.get("word");
  	}

  	dismiss(data) {
      	this.viewCtrl.dismiss(data);
   	}

   	playAudio(audioUrrl){

          this.file = new MediaPlugin(audioUrrl);
          this.file.init.then(() => {
              this.file.release();
          }, (err) => {
          	  console.log('lỗi phát mp3')
            	console.log('somthing went wrong! error code: ' + err.code + ' message: ' + err.message);
          });
          
    		  this.file.play();
    }

    // showAddExamplePopup(e) {
    //   e.stopPropagation();
    //   let alert = this.alertCtrl.create({
    //       title: 'Thêm ví dụ',
    //       cssClass : 'add-example-popup',
    //       inputs: [
    //           {
    //             name: 'example',
    //             placeholder: 'Thêm ví dụ'
    //           },
    //           {
    //             name: 'exampleMean',
    //             placeholder: 'Thêm nghĩa'
    //           }
    //       ],
    //       buttons: [
    //           {
    //             text: 'Bỏ',
    //             role: 'cancel',
    //             handler: data => {
    //               console.log('Cancel clicked');
    //               alert.dismiss();
    //             }
    //           },
    //           {
    //             text: 'Thêm',
    //             handler: data => {
    //               let example = data.example, exampleMean = data.exampleMean;
    //               if(example.length == 0 || exampleMean.length == 0){
    //                   let toast = this.toastCtrl.create({
    //                       message: 'Vui lòng nhập đầy đủ thông tin !',
    //                       duration: 3000,
    //                       position: 'top'
    //                   });
    //                   toast.present();
    //               }else{
    //                   this.word.example = example;this.word.example_mean = exampleMean;
    //                   this.databaseService.updateWord(this.word).then(()=>{
    //                       alert.dismiss();
    //                   })
    //               }
    //             }
    //           }
    //       ]
    //   });
    //   alert.present();
    // }

}