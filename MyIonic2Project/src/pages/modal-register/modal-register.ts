import { Component } from '@angular/core';
import { ViewController, NavParams, ModalController, AlertController, ToastController  } from 'ionic-angular';
import { Http, Response, Headers, RequestOptions } from '@angular/http';


import {VariableService} from '../../providers/variable-service';
import {DatabaseService} from '../../providers/database-service';


@Component({
  selector: 'modal-register',
  templateUrl: 'modal-register.html',
  providers: [VariableService]
})
export class RegisterModal {
	fullname:string = '';
	email:string = '';
	password:string = '';
	confirmPassword:string = '';

  	constructor(private viewCtrl: ViewController, public navParams: NavParams,public modalCtrl: ModalController,
  	public alertCtrl: AlertController,public toastCtrl: ToastController ,public http: Http, 
  	public globalVariable: VariableService, public databaseService:DatabaseService) {

  	}

  	dismiss(data) {
      	this.viewCtrl.dismiss(data);
   	}

   	register(){
   		let url = this.globalVariable.HOST + '/api/register?email=' + this.email.trim() + "&password=" + this.password.trim() +
														"&type=0&fullname=" + this.fullname.trim();

		return this.http.get(url).map((res:Response) => res.json())
		.subscribe(data => {
			let registerToast = this.toastCtrl.create({
					    message: 'Đăng kí thành công !',
					    duration: 3000,
					    position: 'top'
					});

			registerToast.onDidDismiss(() => {
			    
			    let confirm = this.alertCtrl.create({
      				title: 'Thông báo',
      				message: 'Bạn có muốn đăng nhập bằng tài khoản này ?',
      				buttons: [
				        { 	text: 'Không',
				          	handler: () => {
				            	this.dismiss(false);//ko đăng nhập
				          	}
				        },
				        {	text: 'Đồng ý',
				          	handler: () => {
				            	this.login(this.email,this.password);
				          	}
				        }
      				]
    			});
    			confirm.present();
			});

			registerToast.present();
        }, error => {
            let alert = this.alertCtrl.create({
		      	title: 'Thông báo',
		      	subTitle: 'Có lỗi khi đăng kí ! Vui lòng đăng kí lại',
		     	buttons: ['OK']
		    });
		    alert.present();
        });
   	}

   	login(email, password){
   		let url = this.globalVariable.HOST + '/api/login?email=' + email + "&password=" + password + "&type=0";

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
						    this.dismiss(true);//có đăng nhâpj
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
}
