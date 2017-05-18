import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { DetailPostPage } from '../detail-post/detail-post';
import { LoginModal } from '../modal-login/modal-login';


import {DatabaseService} from '../../providers/database-service';
import {ForumService} from '../../providers/forum-service';
import {Emitter} from '../../providers/rootscope-service';

//Classes
import {User}          from '../../classes/User';
import {Post}          from '../../classes/Post';

@Component({
  selector: 'page-forum',
  templateUrl: 'forum.html',
  providers: [ ForumService] 
})
export class ForumPage {
	isLogined:boolean = false;

    listPosts:Array<Post> = [];
    totalComments:number = 0;

    currentUser:User = null;
    userPost:any = { title: '', content: '', idUser : '', createAt : '' }

    limit:number = 10;

  	constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController,
    public databaseService: DatabaseService, public forumService: ForumService, public zone: NgZone,private scope: Emitter) {
        this.currentUser = navParams.get('currentUser');
        if(this.currentUser){
            this.isLogined = true;
            this.getData(this.limit);
        } 
    }

    getData(limit){
        this.forumService.getAllPosts(limit).then((data)=>{
            this.listPosts = data
        });
    }

  	login(){
        
        let loginModal = this.modalCtrl.create(LoginModal);
        loginModal.present();

        loginModal.onDidDismiss(data => {
            this.databaseService.getUser()
            .then((data) => {
                if(data.rows.length > 0) {
                    this.currentUser = data.rows.item(0);
                    this.isLogined = true;

                    this.scope.emit('loginSuccess',this.currentUser);
                }else{
                    this.currentUser = null;
                }
            });
      });
  	}

    

    randomColor(){
        let arr = ["#ff9900","#BB0000","#222222","#00CC66","#006666","#333399","#663300"];
        return arr[Math.floor(Math.random() * arr.length)];
    }

  	post(){
        if(this.userPost.title == '' && this.userPost.content == ''){

        }else{
            this.userPost.idUser = this.currentUser.id ;     

            this.forumService.userPost(this.userPost) 
            .then((post)=>{
                this.listPosts.unshift(post);
                this.userPost = { title: '', content: '', idUser : '', createAt : '' };
            })
        }    
  	}

  	selectPost(post){
  		this.navCtrl.push(DetailPostPage,{post : post, currentUser: this.currentUser });
  	}

    viewMore(){
        this.limit += 10;
        this.getData(this.limit);
    }
}
