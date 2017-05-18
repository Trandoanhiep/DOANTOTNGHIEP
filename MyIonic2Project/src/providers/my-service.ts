import { Injectable, NgModule } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

import {VariableService} from './variable-service';

@NgModule({
    providers: [VariableService]
})

@Injectable()
export class MyService {
  	constructor(public http: Http, public globalVariable: VariableService) {
  		// console.log(encodeURI("Trần đoàn Hiệp"));
  	}



	login(email, password){
		let url = this.globalVariable.HOST + '/api/login';
		let params = new URLSearchParams();
		params.set('email', email);
		params.set('password', password);

		return this.http.get(url, { search: params })//.map((res: Response) => res.json());
	}

	

}
