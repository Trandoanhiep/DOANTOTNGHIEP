var _word = (function () {
    function _word(_id, _word, _phonetic, _mean, _image, _course_id, _subject_id) {
        this._id = _id;
        this._word = _word;
        this._phonetic = _phonetic;
        this._mean = _mean;
        this._image = _image;
        this._course_id = _course_id;
        this._subject_id = _subject_id;
    }
    Object.defineProperty(_word.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_word.prototype, "word", {
        get: function () {
            return this._word;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_word.prototype, "phonetic", {
        get: function () {
            return this._phonetic;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_word.prototype, "mean", {
        get: function () {
            return this._mean;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_word.prototype, "subject_id", {
        get: function () {
            return this._subject_id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_word.prototype, "course_id", {
        get: function () {
            return this._course_id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_word.prototype, "image", {
        get: function () {
            return this._image;
        },
        enumerable: true,
        configurable: true
    });
    return _word;
}());
export { _word };
//# sourceMappingURL=Word.js.map