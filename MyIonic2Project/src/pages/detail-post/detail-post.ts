import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {ForumService} from '../../providers/forum-service';

@Component({
  selector: 'page-detail-post',
  templateUrl: 'detail-post.html',
  providers: [ForumService] 
})
export class DetailPostPage {
	post:any ;
    currentUser:any = null;
    userComment:any = { content: '', idUser : '', idPost : '' }

    listComments:any = [];
    limit:number = 10;
  	constructor(public navCtrl: NavController, public navParams: NavParams, public forumService: ForumService) {
    		this.post = navParams.get('post');
        this.currentUser = navParams.get('currentUser');

        this.getData(this.post.id,this.limit);
  	}

    getData(postid,limit){
        this.forumService.getAllComments(postid,limit).subscribe((data)=>{
            this.listComments = [];
            for (let i = 0; i < data.length; ++i) {
                let comment = {
                    id : data[i].id,
                    userName: data[i].fullname,
                    userId: data[i].userid,
                    content : data[i].content
                }
                
                this.listComments.push(comment);
            }
        });
    }

  	comment(){
        if(this.userComment.content == ''){

        }else{
            this.userComment.idUser = this.currentUser.id ;     
            this.userComment.idPost = this.post.id ;     

            this.forumService.userComment(this.userComment) 
            .subscribe((data)=>{
                let comment = {
                        id : data.id,
                        userName: data.fullname,
                        userId: data.userid,
                        content : data.content
                    }
                    
                this.listComments.push(comment);
                this.userComment = { content: '', idUser : '', idPost : '' };
            })
        }
            
  	}

    viewMore(){
        this.limit += 10;
        this.getData(this.post.id,this.limit);
    }

}
