import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, ModalController, AlertController } from 'ionic-angular';

import { StatusBar, Splashscreen} from 'ionic-native';

//modal
import { LoginModal }     from '../pages/modal-login/modal-login';
import { RegisterModal }  from '../pages/modal-register/modal-register';

//page
import { CoursesPage } from '../pages/courses/courses';
import { TestPage } from '../pages/test/test';
import { ForumPage } from '../pages/forum/forum';

//service
import {VariableService} from './../providers/variable-service';
import {DatabaseService} from './../providers/database-service';
import {Emitter} from './../providers/rootscope-service';




@Component({
  templateUrl: 'app.html',
  providers: [VariableService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{title: string, component: any, icon:string}>;
  currentUser:any = null;

  constructor( public platform: Platform,public menu: MenuController,public modalCtrl: ModalController,
  public alertCtrl: AlertController, public databaseService:DatabaseService,private scope: Emitter){

      // set our app's pages
      this.pages = [
          { title: 'Hỏi & Đáp',     component: ForumPage ,   icon: 'ios-contacts' },
          { title: 'Thi thử Toeic', component: TestPage ,    icon: 'ios-create' },
          { title: 'Cài đặt',     component: TestPage ,    icon: 'ios-settings' }
      ];

      this.scope.on<any>('initDatabaseSuccess')
      .subscribe(data => {
          this.databaseService.getUser()
          .then((data) => {
                if(data.rows.length > 0) {
                    this.currentUser = data.rows.item(0);
                    console.log(this.currentUser);
                }else{
                    this.currentUser = null;
                }
          }, (err) => {
              console.error('Lỗi get user: ', err);
          });

          this.rootPage = CoursesPage;
      }); 

      this.platform.registerBackButtonAction(() => {
          
      });

      this.scope.on<any>('loginSuccess')
      .subscribe(user => {
          this.currentUser = user;
          console.log(user);
      });
  }

  menuOpenedEvent(){
      this.databaseService.getUser()
      .then((data) => {
            if(data.rows.length > 0) {
                this.currentUser = data.rows.item(0);
            }else{
                this.currentUser = null;
            }
      }, (err) => {
          console.error('Lỗi get lessons: ', err);
      });
  }

  initializeApp() {
      this.platform.ready().then(() => {

          StatusBar.styleDefault();
          Splashscreen.hide();
      });
  }

  showLoginModal(){
      let loginModal = this.modalCtrl.create(LoginModal);
      loginModal.present();

      loginModal.onDidDismiss(data => {
          this.databaseService.getUser()
          .then((data) => {
                if(data.rows.length > 0) {
                    this.currentUser = data.rows.item(0);
                }else{
                    this.currentUser = null;
                }
          });
      });
  }

  showRegisterModal(){
      let registerModal = this.modalCtrl.create(RegisterModal);
      registerModal.present();

      registerModal.onDidDismiss(isLogin => {
          if(isLogin){
              this.databaseService.getUser()
              .then((data) => {
                    if(data.rows.length > 0) {
                        this.currentUser = data.rows.item(0);
                    }else{
                        this.currentUser = null;
                    }
              });
          }
      });
  }

  logout(){
      let confirm = this.alertCtrl.create({
          title: 'Thông báo',
          message: 'Bạn có muốn đăng xuất tài khoản này ?',
          buttons: [
            {   text: 'Không',
                handler: () => {

                }
            },
            {  text: 'Đồng ý',
                handler: () => {
                    this.databaseService.deleteUser().then(()=>{
                        this.currentUser = null;
                    });
                }
            }
          ]
      });
      confirm.present();
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    // this.nav.setRoot(page.component);
    this.nav.push(page.component, {currentUser : this.currentUser });
  }

}
