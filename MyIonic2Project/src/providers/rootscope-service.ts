// import { Injectable, EventEmitter } from '@angular/core';


// @Injectable()
// export class RootscopeService {
//     changeUserRoot = new EventEmitter<any>();
//     private user: any;

//     constructor () {
//     }    

//     public setUser (user: any) {                    
//         this.changeUserRoot.emit(this.user);
//     }
// }


import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

interface EventEmitter {
  key: any;
  data?: any;
}

export class Emitter {
  	private _eventBus: Subject<EventEmitter>;

	constructor() {
	    this._eventBus = new Subject<EventEmitter>();
	}

  	emit(key: any, data?: any) {
    	this._eventBus.next({key, data});
  	}

  	on<T>(key: any): Observable<T> {
    	return this._eventBus.asObservable()
      	.filter(event => event.key === key)
      	.map(event => <T>event.data);
  	}
}