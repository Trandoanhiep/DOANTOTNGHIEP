import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


//page
import { PracticeListenPage }     from '../practice-listen/practice-listen';
import { PracticeSpeakPage }      from '../practice-speak/practice-speak';
import { PracticeWritePage }      from '../practice-write/practice-write';
import { PracticeFlashcardPage }  from '../practice-flashcard/practice-flashcard';

@Component({
  selector: 'page-practice',
  templateUrl: 'practice.html'
})
export class PracticePage {

	  listPractice:any;
    courseId:any;

  	constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.courseId = navParams.get('courseId');

  		this.listPractice = [
  		{
  			name:"Luyện nghe",
  			image:"luyen-nghe.png",
  			des:"Luyện tập kĩ năng nghe bằng cách nghe và chọn đáp án đúng",
  			page: PracticeListenPage
  		},
  		{
  			name:"Luyện phát âm",
  			image:"luyen-noi.png",
  			des:"Luyện tập kĩ năng nói bằng cách phát âm từ theo từ cho sẵn",
  			page:PracticeSpeakPage
  		},
  		{
  			name:"Luyện viết",
  			image:"luyen-viet.png",
  			des:"Luyện tập kĩ năng viết . Hãy sắp xếp các từ theo thứ tự đúng",
  			page:PracticeWritePage
  		},
  		{
  			name:"Flashcard",
  			image:"flashcard.png",
  			des:"Luyện tập với các thẻ flashcard",
  			page:PracticeFlashcardPage
  		}
  		];
  	}

  	selectPractice(page){
  		this.navCtrl.push(page ,{ courseId : this.courseId });
  	}

}
