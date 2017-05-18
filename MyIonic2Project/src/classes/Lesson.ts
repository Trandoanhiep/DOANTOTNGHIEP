export class Lesson{
    private _id:number;
    private _name:string;
    private _course_id:number;
    private _num_word:number;
    private _image:string;
  	constructor(_id:number, _name:string, _course_id:number,_image:string, _num_word:number ) {
        this._id = _id;
        this._name = _name;
        this._course_id = _course_id;
        this._num_word = _num_word;
    		this._image = _image;
  	}


    get id():number{
      return this._id;
    }

    get name():string{
      return this._name;
    }

    get course_id():number{
      return this._num_word;
    }

    get num_word():number{
      return this._num_word;
    }

    get image():string{
      return this._image;
    }

}
