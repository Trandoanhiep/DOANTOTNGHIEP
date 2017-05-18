var Lesson = (function () {
    function Lesson(_id, _name, _course_id, _image, _num_word) {
        this._id = _id;
        this._name = _name;
        this._course_id = _course_id;
        this._num_word = _num_word;
        this._image = _image;
    }
    Object.defineProperty(Lesson.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lesson.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lesson.prototype, "course_id", {
        get: function () {
            return this._num_word;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lesson.prototype, "num_word", {
        get: function () {
            return this._num_word;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lesson.prototype, "image", {
        get: function () {
            return this._image;
        },
        enumerable: true,
        configurable: true
    });
    return Lesson;
}());
export { Lesson };
//# sourceMappingURL=Lesson.js.map