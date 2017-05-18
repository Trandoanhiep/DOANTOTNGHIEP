var Post = (function () {
    function Post(_id, _createAt, _userName, _userId, _title, _content) {
        this._id = _id;
        this._createAt = _createAt;
        this._userName = _userName;
        this._userId = _userId;
        this._title = _title;
        this._content = _content;
    }
    Object.defineProperty(Post.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Post.prototype, "createAt", {
        get: function () {
            return this._createAt;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Post.prototype, "userName", {
        get: function () {
            return this._userName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Post.prototype, "userId", {
        get: function () {
            return this._userId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Post.prototype, "title", {
        get: function () {
            return this._title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Post.prototype, "content", {
        get: function () {
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    return Post;
}());
export { Post };
//# sourceMappingURL=Post.js.map