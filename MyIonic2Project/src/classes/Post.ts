export class Post{
    private _id:number;
    private _createAt:string;
    private _userName:string;
    private _userId:string;
    private _title:string;
    private _content:string;
  	constructor(_id:number, _createAt:string, _userName:string, _userId:string, _title:string, _content:string) {
        this._id = _id;
        this._createAt = _createAt;
        this._userName = _userName;
        this._userId = _userId;
        this._title = _title;
        this._content = _content;
  	}

    get id():number{
      return this._id;
    }

    get createAt():string{
      return this._createAt;
    }

    get userName():string{
      return this._userName;
    }

    get userId():string{
      return this._userId;
    }

    get title():string{
      return this._title;
    }

    get content():string{
      return this._content;
    }

}
