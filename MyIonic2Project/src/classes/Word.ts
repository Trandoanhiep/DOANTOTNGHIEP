export class Word{
    private _id:number;
    private _word:string;
    private _phonetic:string;
    private _mean:string;
    private _image:string;
    private _audio:string;
    private _subject_id:number;
    private _course_id:number;
  	constructor(_id:number, _word:string, _phonetic:string, _mean:string,_image:string,_audio:string,_course_id:number, _subject_id:number ) {
        this._id = _id;
        this._word = _word;
        this._phonetic = _phonetic;
        this._mean = _mean;
        this._image = _image;
        this._audio = _audio;
        this._course_id = _course_id;
        this._subject_id = _subject_id;
  	}

    get id():number{
      return this._id;
    }

    get word():string{
      return this._word;
    }

    get phonetic():string{
      return this._phonetic;
    }

    get mean():string{
      return this._mean;
    }

    get subject_id():number{
      return this._subject_id;
    }

    get course_id():number{
      return this._course_id;
    }

    get image():string{
      return this._image;
    }

    get audio():string{
      return this._audio;
    }

}
