export class User{
    private _id:string;
    private _email:string;
    private _password:string;
    private _fullname:string;
  	constructor(_id:string, _email:string, _password:string, _fullname:string) {
        this._id = _id;
        this._email = _email;
        this._password = _password;
        this._fullname = _fullname;
  	}


    get id():string{
      return this._id;
    }

    get email():string{
      return this._email;
    }

    get password():string{
      return this._password;
    }

    get fullname():string{
      return this._fullname;
    }

}
