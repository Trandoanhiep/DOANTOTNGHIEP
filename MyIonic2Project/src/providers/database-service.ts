import { Injectable, NgModule } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { SQLite } from 'ionic-native';

import {VariableService} from './variable-service';
import {CourseService} from './course-service';
import {DownloadService} from './download-service';
import {Emitter}         from './rootscope-service';

import {Course}          from '../classes/Course';
import {Lesson}          from '../classes/Lesson';
import {Word}            from '../classes/Word';

declare var cordova: any;

@NgModule({
    providers: [VariableService]
})

@Injectable()
export class DatabaseService {
	  db:any;
	
    createWordsTable_sql   = 'CREATE TABLE IF NOT EXISTS "words"   ("id" INTEGER PRIMARY KEY  NOT NULL  UNIQUE , "subject_id" INTEGER,  "course_id" INTEGER, "word" TEXT, "phonetic" TEXT, "mean" TEXT, "example" TEXT, "example_mean" TEXT)';
	  createLessonsTable_sql = 'CREATE TABLE IF NOT EXISTS "lessons" ("id" INTEGER PRIMARY KEY  NOT NULL  UNIQUE , "course_id" INTEGER , "name" TEXT, "num_word" INTEGER)';
	  createCoursesTable_sql = 'CREATE TABLE IF NOT EXISTS "courses" ("id" INTEGER PRIMARY KEY  NOT NULL  UNIQUE , "name" TEXT, "downloaded" INTEGER DEFAULT 0, "desc" TEXT, "num_subject" INTEGER, "num_word" INTEGER)';

    createTestTable_sql = 'CREATE TABLE IF NOT EXISTS "tests" ("idTest" TEXT PRIMARY KEY  NOT NULL  UNIQUE , "reading" INTEGER DEFAULT 0, "listening" INTEGER DEFAULT 0, "finished" INTEGER  DEFAULT 0, "downloaded" INTEGER  DEFAULT 0)';
    createResultTable_sql   = 'CREATE TABLE IF NOT EXISTS "results" ("id" TEXT PRIMARY KEY  NOT NULL  UNIQUE , "id_test" TEXT , "id_question" TEXT , "correct_answer" TEXT , "my_answer" TEXT )';

  	listTableNames:any = [];
    constructor(public http: Http, public globalVariable: VariableService, public downloadService: DownloadService,private scope: Emitter, public courseService: CourseService ) {
    	  console.log('Đã chạy database service');
        this.init();
  	}
    

  	init(){
        this.db = new SQLite();
    		this.db.openDatabase({
    		  	name: 'app.db',
    		  	location: 'default'
    		}).then(() => {
    		  	//mở db thành công thì tạo bảng
            let sqlCheck = "SELECT name FROM sqlite_master WHERE type='table'";
            this.db.executeSql(sqlCheck,{}).then((data) => {
                for(var i = 0; i < data.rows.length; i++) {
                    this.listTableNames.push(data.rows.item(i).name);
                }
                console.log("danh sách bảng");
                console.log(this.listTableNames);
                this.scope.emit('initDatabaseSuccess',null);

                if(this.listTableNames.indexOf('courses') == -1)     this.createTable('courses');
                if(this.listTableNames.indexOf('lessons') == -1)     this.createTable('lessons');
                if(this.listTableNames.indexOf('words') == -1)       this.createTable('words');
                if(this.listTableNames.indexOf('tests') == -1)       this.createTable('tests');
                if(this.listTableNames.indexOf('results') == -1)     this.createTable('results');
                if(this.listTableNames.indexOf('userLogin') == -1)   this.createTable('userLogin');

                // this.dropTable("courses");
                // this.dropTable("lessons");
                // this.dropTable("words");
                // this.dropTable("tests");
                // this.dropTable("results");
                // this.dropTable("userLogin");

            }, (err) => {
                console.error('Lỗi get tên bảng: ', err);
            });
    		}, (error) => {
    		  	console.error('Unable to open database: ', error);
    		});
  	}

  	execute(sql){
  		return this.db.executeSql(sql, {});
  	}

    dropTable(tableName){
       let sql = 'DROP TABLE ' + tableName;
       return this.execute(sql).then(()=>{
         console.log("đã xóa bảng : " + tableName);
       });
    }

    initCourses(){
        let url = this.globalVariable.HOST + "/api/all-courses";
        return this.http.get(url).map((res: Response) => res.json());
    }

    initTests(){
        let url = this.globalVariable.HOST + "/toeic/tests.json";
        return this.http.get(url).map((res: Response) => res.json());
    }

    initTable(nameTable){
        if(nameTable == 'courses'){
            let count = 0;
            this.initCourses()
            .subscribe((data) => {
                let listCourses = data;
                
                for (let i = 0; i < listCourses.length; ++i) {
                    listCourses[i].downloaded = 0;
                    this.addCourse(listCourses[i]);
                    this.downloadService.downloadImageOfCourse(listCourses[i].id)
                    .then(()=>{
                        count++;
                        if(count == listCourses.length){
                            this.scope.emit('initCourseTableSuccess',null);
                        }
                    });
                }
            },
            (error) => {
                console.log(error);
            });
        }
        if(nameTable == 'tests'){
            this.initTests()
            .subscribe((data) => {
                let listTests = data.Tests;
                for (let i = 0; i < listTests.length; ++i) {
                    this.addTest(listTests[i]);
                }
            },
            (error) => {
                console.log(error);
            });
        }
    }

  	createTable(nameTable){
    		let sql = '';

        switch (nameTable) {
            case "courses": sql = this.createCoursesTable_sql; break;
            case "lessons": sql = this.createLessonsTable_sql; break;
            case "words": sql = this.createWordsTable_sql; break;
            case "tests": sql = this.createTestTable_sql; break;
            case "results": sql = this.createResultTable_sql; break; 
            default: sql = 'CREATE TABLE IF NOT EXISTS userLogin(id TEXT,email TEXT,password TEXT, fullname TEXT)'; break;
        }

    		this.execute(sql).then(() => {
    			  console.log('tạo bảng ' + nameTable + ' thành công');
            this.listTableNames.push(nameTable);
            this.initTable(nameTable);
  	  	}, (err) => {
  	    	console.error('Lỗi tạo bảng: ', err);
  	  	});
  	}

    importDataIntoDB(course){
        let courseId = course.id;
        let baseUrl = cordova.file.dataDirectory + "data/" + courseId + "/json/";
        return  new Promise<any>((resolve, reject) => {
                    if (course) {
                        this.http.get(baseUrl + "subject.json")
                        .subscribe(( result)=>{
                            let lessons = JSON.parse(result["_body"]);
                            this.importLessons(lessons).then(()=>{
                                setTimeout(() => {
                                    this.http.get(baseUrl + "words.json").subscribe((result)=>{
                                        
                                        let words = JSON.parse(result["_body"]);
                                        this.importWords(words).then(()=>{
                                            console.log('hoàn thành việc import data');
                                            course.downloaded = 1;
                                            this.updateCourse(course).then(()=>{
                                               resolve("Hoan tat update course")
                                            });
                                        })

                                    });
                                }, 250);
                            })
                        });
                    } else{
                        resolve(false)
                    }
                });
    }

    importLessons(lessons){
        return  new Promise<any>((resolve, reject) => {
                      this.db.transaction( (tx) =>{
                          let size = lessons.length;
                          for (let i = 0; i < size; i++) {
                              let lesson = lessons[i];
                              let sql = "INSERT OR IGNORE INTO lessons (id, course_id, name, num_word) " +
                                        "VALUES ('"  + lesson.id + 
                                               "','" + lesson.id_course +
                                               "','" + lesson.name +
                                               "','" + parseInt(lesson.total) + 
                                        "')";
                              tx.executeSql(sql, [], function (res, result) {
                                  console.log(sql)
                                  if(i == (size-1)){
                                      console.log("HOAN THANH IMPORT LESSON");
                                      resolve("HOAN THANH IMPORT LESSON");
                                  }
                              }, (err) =>{
                                  reject('fail');
                              });
                          }
                      },  (e) =>{
                          reject('fail');
                      });
                });
    }

    importWords(words){
        let count = 0;
        return  new Promise<any>((resolve, reject) => {
                      this.db.transaction( (tx) =>{
                          let size = words.length;

                            for (var i = 0; i < size; i++) {
                                let word = words[i];
                                let sql = "INSERT OR IGNORE INTO words (id, subject_id, course_id, word, phonetic, mean, example, example_mean) " +
                                          "VALUES ('"  + word.id_word + 
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
                                    if(count == size){
                                        console.log("HOAN THANH IMPORT word");
                                        resolve("HOAN THANH IMPORT word");
                                    }
                                }, (err) =>{
                                    reject('fail');
                                });
                            }
                        },  (e) =>{
                            reject('fail');
                        });
                });
    }

    saveResultToeic(idTest, result){
        let count = 0;
        return  new Promise<any>((resolve, reject) => {
                      this.db.transaction( (tx) =>{
                            let size = result.length;
                            for (var i = 0; i < size; i++) {
                                let q = result[i];
                                let sql = "INSERT OR IGNORE INTO results (id, id_test, id_question, correct_answer, my_answer) " +
                                          "VALUES ('"  + q.id + 
                                                 "','" + q.idTest +
                                                 "','" + q.idQuestion +
                                                 "','" + q.correctAnswer + 
                                                 "','" + q.myAnswer +  
                                          "')";
                                tx.executeSql(sql, [], function (res, result) {
                                    console.log("insert success: " + sql);
                                    count++
                                    if(count == size){
                                        console.log("HOAN THANH save result");
                                        resolve("HOAN THANH save result");
                                    }
                                }, (err) =>{
                                    resolve(false);
                                });
                            }
                        },  (e) =>{
                            resolve(false);
                        });
                });
    }

    getResultToeic(idTest){
        let sql = "SELECT * FROM results WHERE id_test= '" + idTest + "' " ;
        return this.execute(sql);
    }
    

  	addUser(user){
    		let sql = "INSERT INTO userLogin (id,email,password,fullname) " + 
                  " VALUES ('"  + user.id +
                          "','" + user.email +
                          "','" + user.password + 
                          "','" + user.fullname + "')";
    		return this.execute(sql);
  	}

  	getUser(){
    		let sql = "SELECT * FROM userLogin";
    		

        return  new Promise<any>((resolve, reject) => {
                      if(this.listTableNames.indexOf('userLogin') == -1){
                          resolve({rows : []});
                      }else{
                          this.execute(sql).then((data) => {
                              resolve(data);
                        }, (err) => {
                            resolve({rows : []});
                        });
                      }
                });
  	}

    deleteUser(){
        let sql = "DELETE FROM userLogin";
        return this.execute(sql);
    }

    addWord(word){
        word.example = '';
        word.example_mean = '';
        let sql = "INSERT OR IGNORE INTO words (id, subject_id, course_id, word, phonetic, mean, example, example_mean) " +
                  "VALUES ('"  + word.id_word + 
                         "','" + word.id_subject +
                         "','" + word.id_course +
                         "','" + word.word + 
                         "','" + word.phonetic + 
                         "','" + word.mean +
                         "','" + word.example +
                         "','" + word.example_mean + 
                  "')";
         console.log(sql);         

        this.execute(sql).then(() => {
          console.log('');
        }, (err) => {
          console.error('Lỗi add word: ', err);
      });
    }

    updateWord(word){
        let sql = " UPDATE words SET example='" + word.example + "',example_mean='" + word.example_mean + "' " +
                  "  WHERE id=" + word.id ;
        return this.execute(sql);  
    }

    getAllWords(lessonId, courseId):Promise<Array<Word>>{
        let sql = "SELECT * FROM words WHERE subject_id = " + parseInt(lessonId);

        return  new Promise<Array<Word>>((resolve, reject) => {
                      let arr:Array<Word> = [];
                      if(this.listTableNames.indexOf('lessons') == -1){
                           resolve(arr);
                      }else{
                          this.execute(sql).then((data) => {
                              
                              if(data.rows.length > 0) {
                                  for(let i = 0; i < data.rows.length; i++) {
                                      let tmp = data.rows.item(i);
                                      let w = new Word(tmp.id, tmp.word, tmp.phonetic, tmp.mean, this.courseService.getUrlImageWord(courseId, tmp.id), this.courseService.getUrlAudioWord(courseId, tmp.id), tmp.course_id, tmp.subject_id)
                                      arr.push(w);
                                  }

                                  resolve(arr);
                              }
                        }, (err) => {
                             resolve(arr);
                        });
                      }
                }); 
    }

    getAllWordsOfCourse(courseId):Promise<Array<Word>>{
        let sql = "SELECT * FROM words WHERE course_id = " + parseInt(courseId);
        return  new Promise<Array<Word>>((resolve, reject) => {
                      let arr:Array<Word> = [];
                      if(this.listTableNames.indexOf('lessons') == -1){
                           resolve(arr);
                      }else{
                          this.execute(sql).then((data) => {
                              
                              if(data.rows.length > 0) {
                                  for(let i = 0; i < data.rows.length; i++) {
                                      let tmp = data.rows.item(i);
                                      let w = new Word(tmp.id, tmp.word, tmp.phonetic, tmp.mean, this.courseService.getUrlImageWord(courseId, tmp.id), this.courseService.getUrlAudioWord(courseId, tmp.id), tmp.course_id, tmp.subject_id)
                                      arr.push(w);
                                  }

                                  resolve(arr);
                              }
                        }, (err) => {
                             resolve(arr);
                        });
                      }
                });
    }

    addLesson(lesson){
        let sql = "INSERT OR IGNORE INTO lessons (id, course_id, name, num_word) " +
                  "VALUES ('"  + lesson.id + 
                         "','" + lesson.id_course +
                         "','" + lesson.name +
                         "','" + parseInt(lesson.total) + 
                  "')";
        return this.execute(sql);
    }

    getLesson(lessonId){
        let sql = '';
        this.execute(sql).then(() => {
          console.log('');
        }, (err) => {
          console.error('Lỗi get lesson: ', err);
        });
    }

    getAllLessons(courseId):Promise<Array<Lesson>>{
        let sql = "SELECT * FROM lessons WHERE course_id = " + parseInt(courseId);
        return  new Promise<Array<Lesson>>((resolve, reject) => {
                      let arr:Array<Lesson> = [];
                      if(this.listTableNames.indexOf('lessons') == -1){
                           resolve(arr);
                      }else{
                          this.execute(sql).then((data) => {
                              
                              if(data.rows.length > 0) {
                                  for(let i = 0; i < data.rows.length; i++) {
                                      let tmp = data.rows.item(i);
                                      let l = new Lesson(tmp.id, tmp.name, tmp.course_id, this.courseService.getUrlImageLesson(courseId, tmp.id), tmp.num_word)
                                      arr.push(l);
                                  }

                                  resolve(arr);
                              }
                        }, (err) => {
                             resolve(arr);
                        });
                      }
                }); 
    }  

    addCourse(course){
        course.desc = '';
        let sql = "INSERT OR IGNORE INTO courses (id, name, downloaded, desc, num_subject, num_word) " +
                  "VALUES ('"  + course.id + 
                         "','" + course.name +
                         "'," + course.downloaded +
                         ",'" + course.desc + 
                         "'," + course.subject + 
                         "," + course.word +
                  ")";
        return this.execute(sql);
    }

    getCourse(courseId){
        let sql = '';
        return this.execute(sql);
    }

    getAllCourses():Promise<Array<Course>>{
        let sql = 'SELECT * FROM courses';
        return  new Promise<Array<Course>>((resolve, reject) => {
                      let arr:Array<Course> = [];
                      if(this.listTableNames.indexOf('courses') == -1){
                          // resolve({rows : []});
                           resolve(arr);
                      }else{
                          this.execute(sql).then((data) => {
                              
                              if(data.rows.length > 0) {
                                  for(let i = 0; i < data.rows.length; i++) {
                                      let tmp = data.rows.item(i);
                                      let c = new Course(tmp.id, tmp.name, tmp.downloaded, tmp.num_subject, tmp.num_word, this.courseService.getUrlImageCourse(tmp.id))
                                      arr.push(c);
                                  }

                                  resolve(arr);
                              }
                        }, (err) => {
                            // resolve({rows : []});
                             resolve(arr);
                        });
                      }
                }); 
    }

    updateCourse(course){
        let sql = " UPDATE courses SET name='" + course.name + "',downloaded=" + course.downloaded + ",desc='" + course.desc + "',num_subject=" + course.num_subject + ",num_word=" + course.num_word +
                  "  WHERE id=" + course.id ;
        return this.execute(sql);  
    }

    getAllToeicTests(){
        let sql = "SELECT * FROM tests"; 
        return this.execute(sql);            
    }

    addTest(test){
        let sql = "INSERT OR REPLACE INTO tests (idTest, reading, listening, finished, downloaded) " +
                "VALUES ('"  + test.idTest + 
                       "'," + test.reading +
                       "," + test.listening +
                       "," + test.finished + 
                       "," + test.downloaded + 
                ")";
        return this.execute(sql);
    }

    updateTest(test){
      console.log(test)
      console.log("update test");
        let sql = " UPDATE tests SET reading=" + test.reading + ",listening=" + test.listening + ",finished=" + test.finished + ",downloaded=" + test.downloaded +
                  "  WHERE idTest='" + test.idTest + "'";
        return this.execute(sql);
    }
}
