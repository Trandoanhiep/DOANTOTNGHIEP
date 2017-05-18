var Course = (function () {
    function Course(_id, _name, _downloaded, totalLesson, totalWord, _image) {
        this._id = _id;
        this._name = _name;
        this._downloaded = _downloaded;
        this._num_subject = totalLesson;
        this._num_word = totalWord;
        this._image = _image;
    }
    Object.defineProperty(Course.prototype, "downloaded", {
        get: function () {
            return this._downloaded;
        },
        set: function (_downloaded) {
            this._downloaded = _downloaded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Course.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Course.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Course.prototype, "num_subject", {
        get: function () {
            return this._num_subject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Course.prototype, "num_word", {
        get: function () {
            return this._num_word;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Course.prototype, "image", {
        get: function () {
            return this._image;
        },
        enumerable: true,
        configurable: true
    });
    return Course;
}());
export { Course };
//# sourceMappingURL=Course.js.map