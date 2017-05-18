var Comment = (function () {
    function Comment(_id, _userName, _userId, _content) {
        this._id = _id;
        this._userName = _userName;
        this._userId = _userId;
        this._content = _content;
    }
    Object.defineProperty(Comment.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Comment.prototype, "userName", {
        get: function () {
            return this._userName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Comment.prototype, "userId", {
        get: function () {
            return this._userId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Comment.prototype, "content", {
        get: function () {
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    return Comment;
}());
export { Comment };
//# sourceMappingURL=Comment.js.map