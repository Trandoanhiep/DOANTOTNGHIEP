var ToeicTest = (function () {
    function ToeicTest(_idTest, _reading, _listening, _finished, _downloaded) {
        this._idTest = _idTest;
        this._reading = _reading;
        this._listening = _listening;
        this._finished = _finished;
        this._downloaded = _downloaded;
    }
    Object.defineProperty(ToeicTest.prototype, "finished", {
        get: function () {
            return this._finished;
        },
        set: function (_finished) {
            this._finished = _finished;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToeicTest.prototype, "idTest", {
        get: function () {
            return this._idTest;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToeicTest.prototype, "reading", {
        get: function () {
            return this._reading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToeicTest.prototype, "listening", {
        get: function () {
            return this._listening;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToeicTest.prototype, "downloaded", {
        get: function () {
            return this._downloaded;
        },
        set: function (_downloaded) {
            this._downloaded = _downloaded;
        },
        enumerable: true,
        configurable: true
    });
    return ToeicTest;
}());
export { ToeicTest };
//# sourceMappingURL=ToeicTest.js.map