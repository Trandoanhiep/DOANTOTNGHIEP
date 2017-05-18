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
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
var Emitter = (function () {
    function Emitter() {
        this._eventBus = new Subject();
    }
    Emitter.prototype.emit = function (key, data) {
        this._eventBus.next({ key: key, data: data });
    };
    Emitter.prototype.on = function (key) {
        return this._eventBus.asObservable()
            .filter(function (event) { return event.key === key; })
            .map(function (event) { return event.data; });
    };
    return Emitter;
}());
export { Emitter };
//# sourceMappingURL=rootscope-service.js.map