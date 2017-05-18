import { Injectable, NgModule } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import {DatabaseService} from './database-service';

declare var cordova: any;

@NgModule({
    providers: [DatabaseService]
})

@Injectable()
export class ToeicService {
  	constructor(public http: Http, public databaseService: DatabaseService) {

  	}

  	loadScoreTable(){
    		let url = "./assets/calcToeicScore.json";
  		  return this.http.get(url).map((res: Response) => res.json());
  	}

    calcToeicScore(result){
        let trueIcon:string  = './assets/icon/true-icon.png';
        let falseIcon:string = './assets/icon/false-icon.png';
        let obj = {
            listeningScore : 0,
            readingScore : 0,
            part1 : [],
            part2 : [],
            part3 : [],
            part4 : [],
            part5 : [],
            part6 : [],
            part7 : []
        }
        let countListening = 0;
        let countReading = 0;
        for (let i = 0; i < result.length; ++i) { 
            let r = {
              idQuestion : result[i].id_question,
              class : "",
              icon : ""
            }
            if(parseInt(result[i].id_question) >= 1 && parseInt(result[i].id_question) <= 10){
                if(result[i].correct_answer == result[i].my_answer){
                    r.class = 'true'; r.icon = trueIcon;
                    countListening++;
                }else{
                    r.class = 'false'; r.icon = falseIcon;
                }
                obj.part1.push(r);
            }else if(parseInt(result[i].id_question) >= 11 && parseInt(result[i].id_question) <= 40){
                if(result[i].correct_answer == result[i].my_answer){
                    r.class = 'true'; r.icon = trueIcon;
                    countListening++;
                }else{
                    r.class = 'false'; r.icon = falseIcon;
                }
                obj.part2.push(r);
            }else if(parseInt(result[i].id_question) >= 41 && parseInt(result[i].id_question) <= 70){
                if(result[i].correct_answer == result[i].my_answer){
                    r.class = 'true'; r.icon = trueIcon;
                    countListening++;
                }else{
                    r.class = 'false'; r.icon = falseIcon;
                }
                obj.part3.push(r);
            }else if(parseInt(result[i].id_question) >= 71 && parseInt(result[i].id_question) <= 100){
                if(result[i].correct_answer == result[i].my_answer){
                    r.class = 'true'; r.icon = trueIcon;
                    countListening++;
                }else{
                    r.class = 'false'; r.icon = falseIcon;
                }
                obj.part4.push(r);
            }else if(parseInt(result[i].id_question) >= 101 && parseInt(result[i].id_question) <= 140){
                if(result[i].correct_answer == result[i].my_answer){
                    r.class = 'true'; r.icon = trueIcon;
                    countReading++;
                }else{
                    r.class = 'false'; r.icon = falseIcon;
                }
                obj.part5.push(r); 
            }else if(parseInt(result[i].id_question) >= 141 && parseInt(result[i].id_question) <= 152){
                if(result[i].correct_answer == result[i].my_answer){
                    r.class = 'true'; r.icon = trueIcon;
                    countReading++;
                }else{
                    r.class = 'false'; r.icon = falseIcon;
                }
                obj.part6.push(r);
            }else if(parseInt(result[i].id_question) >= 153 && parseInt(result[i].id_question) <= 200){
                if(result[i].correct_answer == result[i].my_answer){
                    r.class = 'true'; r.icon = trueIcon;
                    countReading++;
                }else{
                    r.class = 'false'; r.icon = falseIcon;
                }
                obj.part7.push(r);
            }   

        }

        return  new Promise<any>((resolve, reject) => {
                      this.loadScoreTable().subscribe((data)=>{
                          obj.listeningScore = data.listening[countListening];
                          obj.readingScore   = data.reading[countReading];

                          resolve(obj)
                      }) 
                });      
    }

    getPartData(idTest,idPart){
        let url = cordova.file.dataDirectory + "toeic/" + idTest + "/" + idPart + "/data.json";
        return this.http.get(url).map((res: Response) => res.json());
    }

    getImagePart1(idTest, idPart, id){
        return cordova.file.dataDirectory + "toeic/" + idTest + "/" + idPart + '/images/' + id + '.png';
    }

    getAudioListening(idTest, idPart){
        return cordova.file.dataDirectory + "toeic/" + idTest + "/" + idPart + "/" + idPart + ".mp3";
    }

}
