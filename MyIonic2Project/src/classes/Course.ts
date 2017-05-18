
export class Course{
    private _id:number;
    private _name:string;
    private _downloaded:number;
    private _num_subject:number;
    private _num_word:number;
    private _image:string;
    constructor(_id:number, _name:string, _downloaded:number,totalLesson:number, totalWord:number, _image:string ) {
        this._id = _id;
        this._name = _name;
        this._downloaded = _downloaded;
        this._num_subject = totalLesson;
        this._num_word = totalWord;
        this._image = _image;
    }

    set downloaded(_downloaded:number){
        this._downloaded = _downloaded;
    }

    get id(){
      return this._id;
    }

    get name(){
      return this._name;
    }

    get downloaded(){
      return this._downloaded;
    }

    get num_subject(){
      return this._num_subject;
    }

    get num_word(){
      return this._num_word;
    }

    get image(){
      return this._image;
    }

}
