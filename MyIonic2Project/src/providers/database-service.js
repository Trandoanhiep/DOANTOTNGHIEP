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
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite } from 'ionic-native';
import { VariableService } from './variable-service';
import { DownloadService } from './download-service';
import { Emitter } from './rootscope-service';
var DatabaseService = (function () {
    function DatabaseService(http, globalVariable, downloadService, scope) {
        this.http = http;
        this.globalVariable = globalVariable;
        this.downloadService = downloadService;
        this.scope = scope;
        this.createWordsTable_sql = 'CREATE TABLE IF NOT EXISTS "words"   ("id" INTEGER PRIMARY KEY  NOT NULL  UNIQUE , "subject_id" INTEGER,  "course_id" INTEGER, "word" TEXT, "phonetic" TEXT, "mean" TEXT, "example" TEXT, "example_mean" TEXT)';
        this.createLessonsTable_sql = 'CREATE TABLE IF NOT EXISTS "lessons" ("id" INTEGER PRIMARY KEY  NOT NULL  UNIQUE , "course_id" INTEGER , "name" TEXT, "num_word" INTEGER)';
        this.createCoursesTable_sql = 'CREATE TABLE IF NOT EXISTS "courses" ("id" INTEGER PRIMARY KEY  NOT NULL  UNIQUE , "name" TEXT, "downloaded" INTEGER DEFAULT 0, "desc" TEXT, "num_subject" INTEGER, "num_word" INTEGER)';
        this.createTestTable_sql = 'CREATE TABLE IF NOT EXISTS "tests" ("idTest" TEXT PRIMARY KEY  NOT NULL  UNIQUE , "reading" INTEGER DEFAULT 0, "listening" INTEGER DEFAULT 0, "finished" INTEGER  DEFAULT 0, "downloaded" INTEGER  DEFAULT 0)';
        this.createResultTable_sql = 'CREATE TABLE IF NOT EXISTS "results" ("id" TEXT PRIMARY KEY  NOT NULL  UNIQUE , "id_test" TEXT , "id_question" TEXT , "correct_answer" TEXT , "my_answer" TEXT )';
        this.listTableNames = [];
        console.log('Đã chạy database service');
        this.init();
    }
    DatabaseService.prototype.init = function () {
        var _this = this;
        this.db = new SQLite();
        this.db.openDatabase({
            name: 'app.db',
            location: 'default'
        }).then(function () {
            //mở db thành công thì tạo bảng
            var sqlCheck = "SELECT name FROM sqlite_master WHERE type='table'";
            _this.db.executeSql(sqlCheck, {}).then(function (data) {
                for (var i = 0; i < data.rows.length; i++) {
                    _this.listTableNames.push(data.rows.item(i).name);
                }
                console.log("danh sách bảng");
                console.log(_this.listTableNames);
                _this.scope.emit('initDatabaseSuccess', null);
                if (_this.listTableNames.indexOf('courses') == -1)
                    _this.createTable('courses');
                if (_this.listTableNames.indexOf('lessons') == -1)
                    _this.createTable('lessons');
                if (_this.listTableNames.indexOf('words') == -1)
                    _this.createTable('words');
                if (_this.listTableNames.indexOf('tests') == -1)
                    _this.createTable('tests');
                if (_this.listTableNames.indexOf('results') == -1)
                    _this.createTable('results');
                if (_this.listTableNames.indexOf('userLogin') == -1)
                    _this.createTable('userLogin');
                // this.dropTable("courses");
                // this.dropTable("lessons");
                // this.dropTable("words");
                // this.dropTable("tests");
                // this.dropTable("results");
                // this.dropTable("userLogin");
            }, function (err) {
                console.error('Lỗi get tên bảng: ', err);
            });
        }, function (error) {
            console.error('Unable to open database: ', error);
        });
    };
    DatabaseService.prototype.execute = function (sql) {
        return this.db.executeSql(sql, {});
    };
    DatabaseService.prototype.dropTable = function (tableName) {
        var sql = 'DROP TABLE ' + tableName;
        return this.execute(sql).then(function () {
            console.log("đã xóa bảng : " + tableName);
        });
    };
    DatabaseService.prototype.initCourses = function () {
        var url = this.globalVariable.HOST + "/api/all-courses";
        return this.http.get(url).map(function (res) { return res.json(); });
    };
    DatabaseService.prototype.initTests = function () {
        var url = this.globalVariable.HOST + "/toeic/tests.json";
        return this.http.get(url).map(function (res) { return res.json(); });
    };
    DatabaseService.prototype.initTable = function (nameTable) {
        var _this = this;
        if (nameTable == 'courses') {
            var count_1 = 0;
            this.initCourses()
                .subscribe(function (data) {
                var listCourses = data;
                for (var i = 0; i < listCourses.length; ++i) {
                    listCourses[i].downloaded = 0;
                    _this.addCourse(listCourses[i]);
                    _this.downloadService.downloadImageOfCourse(listCourses[i].id)
                        .then(function () {
                        count_1++;
                        if (count_1 == listCourses.length) {
                            _this.scope.emit('initCourseTableSuccess', null);
                        }
                    });
                }
            }, function (error) {
                console.log(error);
            });
        }
        if (nameTable == 'tests') {
            this.initTests()
                .subscribe(function (data) {
                var listTests = data.Tests;
                for (var i = 0; i < listTests.length; ++i) {
                    _this.addTest(listTests[i]);
                }
            }, function (error) {
                console.log(error);
            });
        }
    };
    DatabaseService.prototype.createTable = function (nameTable) {
        var _this = this;
        var sql = '';
        switch (nameTable) {
            case "courses":
                sql = this.createCoursesTable_sql;
                break;
            case "lessons":
                sql = this.createLessonsTable_sql;
                break;
            case "words":
                sql = this.createWordsTable_sql;
                break;
            case "tests":
                sql = this.createTestTable_sql;
                break;
            case "results":
                sql = this.createResultTable_sql;
                break;
            default:
                sql = 'CREATE TABLE IF NOT EXISTS userLogin(id TEXT,email TEXT,password TEXT, fullname TEXT)';
                break;
        }
        this.execute(sql).then(function () {
            console.log('tạo bảng ' + nameTable + ' thành công');
            _this.listTableNames.push(nameTable);
            _this.initTable(nameTable);
        }, function (err) {
            console.error('Lỗi tạo bảng: ', err);
        });
    };
    DatabaseService.prototype.importDataIntoDB = function (course) {
        var _this = this;
        var courseId = course.id;
        var baseUrl = cordova.file.dataDirectory + "data/" + courseId + "/json/";
        return new Promise(function (resolve, reject) {
            if (course) {
                _this.http.get(baseUrl + "subject.json")
                    .subscribe(function (result) {
                    var lessons = JSON.parse(result["_body"]);
                    _this.importLessons(lessons).then(function () {
                        setTimeout(function () {
                            _this.http.get(baseUrl + "words.json").subscribe(function (result) {
                                var words = JSON.parse(result["_body"]);
                                _this.importWords(words).then(function () {
                                    console.log('hoàn thành việc import data');
                                    course.downloaded = 1;
                                    _this.updateCourse(course).then(function () {
                                        resolve("Hoan tat update course");
                                    });
                                });
                            });
                        }, 250);
                    });
                });
            }
            else {
                resolve(false);
            }
        });
    };
    DatabaseService.prototype.importLessons = function (lessons) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.transaction(function (tx) {
                var size = lessons.length;
                var _loop_1 = function (i) {
                    var lesson = lessons[i];
                    var sql = "INSERT OR IGNORE INTO lessons (id, course_id, name, num_word) " +
                        "VALUES ('" + lesson.id +
                        "','" + lesson.id_course +
                        "','" + lesson.name +
                        "','" + parseInt(lesson.total) +
                        "')";
                    tx.executeSql(sql, [], function (res, result) {
                        console.log(sql);
                        if (i == (size - 1)) {
                            console.log("HOAN THANH IMPORT LESSON");
                            resolve("HOAN THANH IMPORT LESSON");
                        }
                    }, function (err) {
                        reject('fail');
                    });
                };
                for (var i = 0; i < size; i++) {
                    _loop_1(i);
                }
            }, function (e) {
                reject('fail');
            });
        });
    };
    DatabaseService.prototype.importWords = function (words) {
        var _this = this;
        var count = 0;
        return new Promise(function (resolve, reject) {
            _this.db.transaction(function (tx) {
                var size = words.length;
                var _loop_2 = function () {
                    var word = words[i];
                    var sql = "INSERT OR IGNORE INTO words (id, subject_id, course_id, word, phonetic, mean, example, example_mean) " +
                        "VALUES ('" + word.id_word +
                        "','" + word.id_subject +
                        "','" + word.id_course +
                        "','" + word.word +
                        "','" + word.phonetic +
                        "','" + word.mean +
                        "','" + word.example +
                        "','" + word.example_mean +
                        "')";
                    tx.executeSql(sql, [], function (res, result) {
                        count++;
                        console.log(count + ".insert success: " + sql);
                        if (count == size) {
                            console.log("HOAN THANH IMPORT word");
                            resolve("HOAN THANH IMPORT word");
                        }
                    }, function (err) {
                        reject('fail');
                    });
                };
                for (var i = 0; i < size; i++) {
                    _loop_2();
                }
            }, function (e) {
                reject('fail');
            });
        });
    };
    DatabaseService.prototype.saveResultToeic = function (idTest, result) {
        var _this = this;
        var count = 0;
        return new Promise(function (resolve, reject) {
            _this.db.transaction(function (tx) {
                var size = result.length;
                var _loop_3 = function () {
                    var q = result[i];
                    var sql = "INSERT OR IGNORE INTO results (id, id_test, id_question, correct_answer, my_answer) " +
                        "VALUES ('" + q.id +
                        "','" + q.idTest +
                        "','" + q.idQuestion +
                        "','" + q.correctAnswer +
                        "','" + q.myAnswer +
                        "')";
                    tx.executeSql(sql, [], function (res, result) {
                        console.log("insert success: " + sql);
                        count++;
                        if (count == size) {
                            console.log("HOAN THANH save result");
                            resolve("HOAN THANH save result");
                        }
                    }, function (err) {
                        resolve(false);
                    });
                };
                for (var i = 0; i < size; i++) {
                    _loop_3();
                }
            }, function (e) {
                resolve(false);
            });
        });
    };
    DatabaseService.prototype.getResultToeic = function (idTest) {
        var sql = "SELECT * FROM results WHERE id_test= '" + idTest + "' ";
        return this.execute(sql);
    };
    DatabaseService.prototype.addUser = function (user) {
        var sql = "INSERT INTO userLogin (id,email,password,fullname) " +
            " VALUES ('" + user.id +
            "','" + user.email +
            "','" + user.password +
            "','" + user.fullname + "')";
        return this.execute(sql);
    };
    DatabaseService.prototype.getUser = function () {
        var _this = this;
        var sql = "SELECT * FROM userLogin";
        return new Promise(function (resolve, reject) {
            if (_this.listTableNames.indexOf('userLogin') == -1) {
                resolve({ rows: [] });
            }
            else {
                _this.execute(sql).then(function (data) {
                    resolve(data);
                }, function (err) {
                    resolve({ rows: [] });
                });
            }
        });
    };
    DatabaseService.prototype.deleteUser = function () {
        var sql = "DELETE FROM userLogin";
        return this.execute(sql);
    };
    DatabaseService.prototype.addWord = function (word) {
        word.example = '';
        word.example_mean = '';
        var sql = "INSERT OR IGNORE INTO words (id, subject_id, course_id, word, phonetic, mean, example, example_mean) " +
            "VALUES ('" + word.id_word +
            "','" + word.id_subject +
            "','" + word.id_course +
            "','" + word.word +
            "','" + word.phonetic +
            "','" + word.mean +
            "','" + word.example +
            "','" + word.example_mean +
            "')";
        console.log(sql);
        this.execute(sql).then(function () {
            console.log('');
        }, function (err) {
            console.error('Lỗi add word: ', err);
        });
    };
    DatabaseService.prototype.updateWord = function (word) {
        var sql = " UPDATE words SET example='" + word.example + "',example_mean='" + word.example_mean + "' " +
            "  WHERE id=" + word.id;
        return this.execute(sql);
    };
    DatabaseService.prototype.getAllWords = function (lessonId) {
        var sql = "SELECT * FROM words WHERE subject_id = " + parseInt(lessonId);
        return this.execute(sql);
    };
    DatabaseService.prototype.getAllWordsOfCourse = function (courseId) {
        var sql = "SELECT * FROM words WHERE course_id = " + parseInt(courseId);
        return this.execute(sql);
    };
    DatabaseService.prototype.addLesson = function (lesson) {
        var sql = "INSERT OR IGNORE INTO lessons (id, course_id, name, num_word) " +
            "VALUES ('" + lesson.id +
            "','" + lesson.id_course +
            "','" + lesson.name +
            "','" + parseInt(lesson.total) +
            "')";
        return this.execute(sql);
    };
    DatabaseService.prototype.getLesson = function (lessonId) {
        var sql = '';
        this.execute(sql).then(function () {
            console.log('');
        }, function (err) {
            console.error('Lỗi get lesson: ', err);
        });
    };
    DatabaseService.prototype.getAllLessons = function (courseId) {
        courseId = 101000002;
        var sql = "SELECT * FROM lessons WHERE course_id = " + parseInt(courseId);
        return this.execute(sql);
    };
    DatabaseService.prototype.addCourse = function (course) {
        course.desc = '';
        var sql = "INSERT OR IGNORE INTO courses (id, name, downloaded, desc, num_subject, num_word) " +
            "VALUES ('" + course.id +
            "','" + course.name +
            "'," + course.downloaded +
            ",'" + course.desc +
            "'," + course.subject +
            "," + course.word +
            ")";
        return this.execute(sql);
    };
    DatabaseService.prototype.getCourse = function (courseId) {
        var sql = '';
        return this.execute(sql);
    };
    DatabaseService.prototype.getAllCourses = function () {
        var _this = this;
        var sql = 'SELECT * FROM courses';
        return new Promise(function (resolve, reject) {
            if (_this.listTableNames.indexOf('courses') == -1) {
                resolve({ rows: [] });
            }
            else {
                _this.execute(sql).then(function (data) {
                    resolve(data);
                }, function (err) {
                    resolve({ rows: [] });
                });
            }
        });
    };
    DatabaseService.prototype.updateCourse = function (course) {
        var sql = " UPDATE courses SET name='" + course.name + "',downloaded=" + course.downloaded + ",desc='" + course.desc + "',num_subject=" + course.num_subject + ",num_word=" + course.num_word +
            "  WHERE id=" + course.id;
        return this.execute(sql);
    };
    DatabaseService.prototype.getAllToeicTests = function () {
        var sql = "SELECT * FROM tests";
        return this.execute(sql);
    };
    DatabaseService.prototype.addTest = function (test) {
        var sql = "INSERT OR REPLACE INTO tests (idTest, reading, listening, finished, downloaded) " +
            "VALUES ('" + test.idTest +
            "'," + test.reading +
            "," + test.listening +
            "," + test.finished +
            "," + test.downloaded +
            ")";
        return this.execute(sql);
    };
    DatabaseService.prototype.updateTest = function (test) {
        console.log(test);
        console.log("update test");
        var sql = " UPDATE tests SET reading=" + test.reading + ",listening=" + test.listening + ",finished=" + test.finished + ",downloaded=" + test.downloaded +
            "  WHERE idTest='" + test.idTest + "'";
        return this.execute(sql);
    };
    return DatabaseService;
}());
DatabaseService = __decorate([
    NgModule({
        providers: [VariableService]
    }),
    Injectable(),
    __metadata("design:paramtypes", [Http, VariableService, DownloadService, Emitter])
], DatabaseService);
export { DatabaseService };
//# sourceMappingURL=database-service.js.map