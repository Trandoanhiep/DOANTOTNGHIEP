export class ToeicTest{
    private _idTest:string;
    private _reading:number;
    private _listening:number;
    private _finished:number;
    private _downloaded:number;
  	constructor(_idTest:string, _reading:number, _listening:number,_finished:number,_downloaded:number) {
        this._idTest = _idTest;
        this._reading = _reading;
        this._listening = _listening;
        this._finished = _finished;
        this._downloaded = _downloaded;
  	}

    set finished(_finished:number){
       this._finished = _finished;
    }
    
    get idTest():string{
      return this._idTest;
    }

    get reading():number{
      return this._reading;
    }

    get listening():number{
      return this._listening;
    }

    get finished():number{
      return this._finished;
    }

    get downloaded():number{
      return this._downloaded;
    }

    set downloaded(_downloaded:number){
        this._downloaded = _downloaded;
    }

}
