export class Comment{
    private _id:number;
    private _userName:string;
    private _userId:string;
    private _content:string;
  	constructor(_id:number, _userName:string, _userId:string,_content:string) {
        this._id = _id;
        this._userName = _userName;
        this._userId = _userId;
        this._content = _content;
  	}


    get id():number{
      return this._id;
    }

    get userName():string{
      return this._userName;
    }

    get userId():string{
      return this._userId;
    }

    get content():string{
      return this._content;
    }

}
