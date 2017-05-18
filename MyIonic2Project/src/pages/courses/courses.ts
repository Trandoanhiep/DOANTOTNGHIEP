import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//page
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { TestPage }       from '../test/test';
import { ForumPage }      from '../forum/forum';

//service 
import {CourseService}   from '../../providers/course-service';
import {DatabaseService} from '../../providers/database-service';
import {DownloadService} from '../../providers/download-service';
import {Emitter}         from '../../providers/rootscope-service';

//Classes
import {Course}          from '../../classes/Course';

@Component({
  selector: 'page-courses',
  templateUrl: 'courses.html',
  providers: [CourseService] //
})
export class CoursesPage {
    recognition: any;

  	listCourses:Array<Course> = []; 

    pages: Array<{title: string, component: any, icon:string}>;

    currentUser:any = null;

  	constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    public courseService: CourseService,public databaseService: DatabaseService,public downloadService: DownloadService,private scope: Emitter) {
        this.getData();

        this.scope.on<any>('initCourseTableSuccess')
        .subscribe(data => {
            this.getData();
        });

        this.pages = [
          { title: 'Forum',     component: ForumPage ,   icon: 'ios-contacts' },
          { title: 'Toeic',     component: TestPage ,    icon: 'ios-create' },
          { title: 'Cài đặt',   component: TestPage ,    icon: 'ios-settings' }
        ];

        this.databaseService.getUser()
          .then((data) => {
                if(data.rows.length > 0) {
                    this.currentUser = data.rows.item(0);
                }else{
                    this.currentUser = null;
                }
          }, (err) => {
              console.error('Lỗi get user: ', err);
          });
  	}

    getData(){
        this.databaseService.getAllCourses()
        .then((data) => {
            // if(data.rows.length > 0) {
            //     for(let i = 0; i < data.rows.length; i++) {
            //         data.rows.item(i).image = this.courseService.getUrlImageCourse(data.rows.item(i).id)
            //         this.listCourses.push(data.rows.item(i));
            //     }
            //     console.log(this.listCourses);
            // }

            this.listCourses = data;
            console.log(this.listCourses);
        }, (err) => {
          console.error('Lỗi get all course: ', err);
        }); 
    }

    ionViewDidEnter(){
      console.log("Did Enter 11111111");
    }


  	selectCourse(course){
        if(course.downloaded == 1){
            this.navCtrl.push(HelloIonicPage,{course : course });
        }else{
            let confirm = this.alertCtrl.create({
                  title: 'Thông báo',
                  message: 'Bạn cần tải dữ liệu về để có thể dùng cho những lần sau ?',
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
                            this.downloadService.downloadCourse(course.id,  loadingDownload, loadingUnzip)
                            .then((result) =>{
                                if(result === 0){
                                    console.log('Unzip SUCCESS');
                                    this.databaseService.importDataIntoDB(course)
                                    .then(()=>{
                                        for (let i = 0; i < this.listCourses.length; ++i) {
                                             if(this.listCourses[i].id == course.id){
                                                 this.listCourses[i].downloaded = 1;break;
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

    openPage(page){
        this.navCtrl.push(page.component, {currentUser : this.currentUser });
    }

}
