import { Component } from '@angular/core';
import { ViewController, NavParams, ModalController, AlertController, ToastController  } from 'ionic-angular';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { RegisterModal } from '../modal-register/modal-register';

import {VariableService} from '../../providers/variable-service';
import {DatabaseService} from '../../providers/database-service';

@Component({
  selector: 'modal-login',
  templateUrl: 'modal-login.html',
  providers: [VariableService]
})
export class LoginModal {
	email:string = '';
	password:string = '';
  	constructor(private viewCtrl: ViewController, public navParams: NavParams,public modalCtrl: ModalController,
  	public alertCtrl: AlertController,public toastCtrl: ToastController ,public http: Http, 
  	public globalVariable: VariableService, public databaseService:DatabaseService) {

  	}

  	dismiss(data) {
      	this.viewCtrl.dismiss(data);
   	}

   	showRegisterModal(){
   		let profileModal = this.modalCtrl.create(RegisterModal);
        profileModal.present();
   	}

   	login(){
   		let url = this.globalVariable.HOST + '/api/login?email=' + this.email.trim() + "&password=" + this.password.trim() + "&type=0";

		return this.http.get(url).map((res:Response) => res.json()).subscribe(data => {
            if(data.length > 0){
            	this.databaseService.deleteUser().then(()=>{
            		this.databaseService.addUser(data[0])
					.then(()=>{
						let toast = this.toastCtrl.create({
						    message: 'Đăng nhập thành công !',
						    duration: 3000,
						    position: 'top'
						});

						toast.onDidDismiss(() => {
						    this.dismiss(null);
						});

						toast.present();
					});
            	});
            }else{
            	let alert = this.alertCtrl.create({
    			      	title: 'Thông báo',
    			      	subTitle: 'Sai tài khoản hoặc mật khẩu ! Vui lòng nhập lại',
    			     	  buttons: ['OK']
    			    });
    			    alert.present();
            }
        }, error => {
            let alert = this.alertCtrl.create({
    		      	title: 'Thông báo',
    		      	subTitle: 'Có lỗi khi đăng nhập ! Vui lòng đăng nhập lại',
    		     	  buttons: ['OK']
    		    });
    		    alert.present();
        });
   	}

   	loginWithFB(){

   	}

}
