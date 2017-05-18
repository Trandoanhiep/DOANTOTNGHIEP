import { Injectable, NgModule } from '@angular/core';
import { Http, Response, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

import {VariableService} from './variable-service';

declare let cordova: any;

@NgModule({
    providers: [VariableService]
})

@Injectable()
export class CourseService {
  	constructor(public http: Http, public globalletiable: VariableService) {

  	}

    getUrlImageCourse(courseID){
        let url = cordova.file.dataDirectory + "data/" + courseID + ".jpg";
        return url;
    }

	getUrlImageLesson(courseID, lessonID){
		let url = cordova.file.dataDirectory + "data/" + courseID + "/images/lessons/" + lessonID + ".jpg";
		return url;
	}

	getUrlImageWord(courseID, wordID){
		let url = cordova.file.dataDirectory + "data/" + courseID + "/images/words/" + wordID + ".jpg";
		return url;
	}

	getUrlAudioWord(courseID, wordID){
		let url = cordova.file.dataDirectory + "data/" + courseID + "/audios/" + wordID + ".mp3";
		return url;
	}

	shuffleArray(array) {
      // let newArray = JSON.parse(JSON.stringify(array));
      let newArray = array;
      let m = newArray.length, t, i;

      // While there remain elements to shuffle
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = newArray[m];
        newArray[m] = newArray[i];
        newArray[i] = t;
      }

      	return newArray;
    }

    generateListenPractice = function (list, callback) {
        let length = list.length;        
        let listQuestions = [];
        for (let i = 0; i < length; i++) {
            let answerList = [];
            let word = list[i];            
            answerList.push(word);
            while (answerList.length < 4) {
                let random = list[Math.floor(Math.random() * list.length)];
                let found = false;
                for (let j = 0; j < answerList.length; j++) {
                    if (answerList[j].word == random.word) {
                        found = true;break;
                    }
                }

                if (!found) {
                    answerList.push(random);
                }            
            }

            listQuestions.push(
                {correctAnswer : word , answerList : this.shuffleArray(answerList) }
            );
        }

        callback(listQuestions);
    }

    generateWritePractice = function (list, callback) {
        let length = list.length;        
        let listQuestions = [];
        for (let i = 0; i < length; i++) {
            let word = list[i]; 
            let str = word.word.trim();
            let answerList  = []
            for (let j = 0; j < str.length; ++j) {
            	answerList.push(str[j]);
            }     
            
            listQuestions.push(
                {correctAnswer : word , answerList : this.shuffleArray(answerList) }
            );
        }

        callback(listQuestions);
    }

    generateFlashcardPractice = function (list) {
        let length = list.length;        
        let listFlashcard = [];
        for (let i = 0; i < length; i++) {
        	let word = list[i];
            let flashcard = {
            	id : word.id,
            	audio : word.audio,
            	front : {
            		word  : word.word
            	},
            	back : {
            		word 	 : word.word,
					phonetic : word.phonetic,
					mean     : word.mean,
					example  : word.example,
                    image    : word.image
            	}
            }   

            listFlashcard.push(flashcard);
        }

        return listFlashcard;
    }

    getSimilarityOfString(s1,s2){
        s1 = s1.toLowerCase().trim();
        s2 = s2.toLowerCase().trim();
        let match = 2, missMatch = -1;
        let gapPenalty = -1;

        //các hàm
        let reverse  = function (str) {
            let s = '';
            for (let i = str.length - 1; i >= 0; i--)
                s += str[i];
            return s;
        }
        let valueF =  function (array) {
            let size = array.length ;
            let val = array[0], maxIndex = 0, indexValue = 0;
            let x = {};
            //tìm giá trị max
            for (let i = 0; i < size; i++) {
                if(array[i] > val) val = array[i];
            };
            return val;
        }
        let maxInArray = function (array){
            let maxInd = array[0][0].value;
            let i_max = 0, j_max = 0;
            for(let i = 0;i < array.length; i++){
                for(let j = 0; j < array[i].length; j++){
                    if(array[i][j].value >= maxInd) maxInd =  array[i][j].value;{
                        i_max = i; j_max = j;
                    }
                }
            }
            for(let i = 0;i < array.length; i++){
                for(let j = 0; j < array[i].length; j++){
                    if(array[i][j].value == maxInd){
                        i_max = i; j_max = j;
                    }
                }
            }
            return { i : i_max, j : j_max };
        }
        let arrayS = function (a, b){
            let S = new Array;
            for(let i = 0;i < b.length; i++){
                S[i] = [];
                for(let j = 0; j < a.length; j++){
                    if(b.charAt(i) == a.charAt(j)) S[i][j] = match;
                    else S[i][j] = missMatch;
                }
            }
            return S;
        }
        let arrayF = function (a , b){
            let S = arrayS(a,b);
            let F = new Array;
            for(let i = 0;i < (b.length + 1); i++){
                F[i] = [];
                for(let j = 0; j < (a.length + 1); j++){
                    if ( i == 0 || j == 0) F[i][j] = { value : 0 };
                    else {
                        let indexValue = {};
                        let arr = [ 0,
                                    F[i-1][j-1].value + S[i-1][j-1] , 
                                    F[i][j-1].value + gapPenalty,
                                    F[i-1][j].value + gapPenalty
                                ];
                        let x = valueF(arr);
                        if(x == arr[1])      indexValue = {i : i-1 , j : j-1};
                        else if(x == arr[2]) indexValue = {i : i , j : j-1};
                        else if(x == arr[3]) indexValue = {i : i-1 , j : j};
                        else if(x == arr[0]) indexValue = {};

                        F[i][j] = {
                                    value : x,
                                    index : indexValue
                                    };
                    }
                }
            }
            return F;
        }

        //bắt đầu xử lí
        if(s1 == null) s1='';
        if(s2 == null) s2='';

        let ss1 = '', ss2 = '';

        let F = arrayF(s1,s2);

        let i = maxInArray(F).i;
        let j = maxInArray(F).j;

        while (F[i][j].value != 0) {
            if(F[i][j].index.i == (i-1) && F[i][j].index.j == (j-1) ){
                ss2 += s2[i-1];
                ss1 += s1[j-1];
                --i; --j;
            }
            else if(F[i][j].index.i == (i) && F[i][j].index.j == (j-1) ){
                ss2 += '_' ;
                ss1 += s1[j-1];
                --j;
            }
            else if(F[i][j].index.i == (i-1) && F[i][j].index.j == (j) ){
                ss2 += s2[i-1];
                ss1 += '_' ;
                --i; 
            }
        }

        ss1 = reverse(ss1);
        ss2 = reverse(ss2);
        let distance = 0;
        for(let i = 0; i < ss1.length; i++){
            if(ss1[i] == ss2[i]) distance++;
        }

        let maxLength = (s1.length > s2.length) ? s1.length : s2.length;
        let percent =  (distance * 100.0)/ maxLength;

        return percent;

        // if(percent == 100){
        //     return 5;
        // }else if(83 <= percent && percent <= 99){
        //     return 5;
        // }else if(67 <= percent && percent <= 82){
        //     return 4;
        // }else if(40 <= percent && percent <= 66){
        //     return 3;
        // }else if(1 <= percent && percent <= 39){
        //     return 2;
        // }else{
        //     return 1;
        // }
    }

}
