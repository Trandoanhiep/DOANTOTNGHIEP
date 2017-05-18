import { Injectable, NgModule } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

import {VariableService} from './variable-service';

import {Post}          from '../classes/Post';
import {Comment}       from '../classes/Comment';

@NgModule({
    providers: [VariableService]
})

@Injectable()
export class ForumService {
  	constructor(public http: Http, public globalVariable: VariableService) {
  		
  	}

    convertTime(date){
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        month   = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return day + "/" + month + "/" + year + "  " + hours + ':' + minutes + ' ' + ampm;
    }

  	userPost(post){
  		let url = this.globalVariable.HOST + '/api/user-post?title=' + post.title + "&content=" + post.content +
														"&userid=" + post.idUser;

		  // return this.http.get(url).map((res:Response) => res.json());	
      return  new Promise<Post>((resolve, reject) => {
                  this.http.get(url).map((res:Response) =>{
                      let data =  res.json();
                      let post = new Post(data.id, this.convertTime(new Date(data.createdon)), data.fullname, data.userid, data.title, data.content);
                      resolve(post);
                  }) 
              });											
  	}

  	userComment(comment){
  		let url = this.globalVariable.HOST + "/api/user-comment?content=" + comment.content +
														"&postid=" + comment.idPost + "&userid=" + comment.idUser;

		return this.http.get(url).map((res:Response) => res.json());												
  	}

  	getAllPosts(limit){
  		let url = this.globalVariable.HOST + "/api/get-all-posts?limit=" + limit;

		  // return this.http.get(url).map((res:Response) => res.json());
      let listPosts:Array<Post> = [];
      return  new Promise<Array<Post>>((resolve, reject) => {
                  this.http.get(url).map((res:Response) =>{
                      let data =  res.json();
                      console.log(data);
                       for (let i = 0; i < data.length; ++i) {
                          let p = new Post(data[i].id, this.convertTime(new Date(data[i].createdon)), data[i].fullname, data[i].userid, data[i].title, data[i].content);
                          listPosts.push(p);
                      }

                      resolve(listPosts);
                  }) 
              });
  	}


  	getAllComments(postid, limit){
  		let url = this.globalVariable.HOST + "/api/get-all-comments?postid=" + postid + "&limit=" + limit;

		return this.http.get(url).map((res:Response) => res.json());
  	}
}

