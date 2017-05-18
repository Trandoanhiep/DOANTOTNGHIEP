import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// declare var cordova: any;

@Injectable()
export class VariableService {
	HOST:string = "http://192.168.0.103:3000";
	PATH_COURSE_DATA:string;
	PATH_TOEIC_DATA:string;
  	constructor(public http: Http) {
    	this.HOST = "http://192.168.1.222:3000";
    	// this.PATH_COURSE_DATA = cordova.file.dataDirectory + "data/";
    	// this.PATH_TOEIC_DATA =  cordova.file.dataDirectory + "toeic/";

  	}

}
