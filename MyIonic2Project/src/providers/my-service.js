var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NgModule } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { VariableService } from './variable-service';
var MyService = (function () {
    function MyService(http, globalVariable) {
        this.http = http;
        this.globalVariable = globalVariable;
        // console.log(encodeURI("Trần đoàn Hiệp"));
    }
    MyService.prototype.login = function (email, password) {
        var url = this.globalVariable.HOST + '/api/login';
        var params = new URLSearchParams();
        params.set('email', email);
        params.set('password', password);
        return this.http.get(url, { search: params }); //.map((res: Response) => res.json());
    };
    return MyService;
}());
MyService = __decorate([
    NgModule({
        providers: [VariableService]
    }),
    Injectable(),
    __metadata("design:paramtypes", [Http, VariableService])
], MyService);
export { MyService };
//# sourceMappingURL=my-service.js.map