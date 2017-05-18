var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
//pages
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { TestPage } from '../pages/test/test';
import { TestDetailPage } from '../pages/test-detail/test-detail';
import { TestListeningPage } from '../pages/test-listening/test-listening';
import { TestReadingPage } from '../pages/test-reading/test-reading';
import { TestResultPage } from '../pages/test-result/test-result';
import { ListWordPagePage } from '../pages/list-word-page/list-word-page';
import { PracticePage } from '../pages/practice/practice';
import { PracticeListenPage } from '../pages/practice-listen/practice-listen';
import { PracticeSpeakPage } from '../pages/practice-speak/practice-speak';
import { PracticeWritePage } from '../pages/practice-write/practice-write';
import { PracticeFlashcardPage } from '../pages/practice-flashcard/practice-flashcard';
import { CoursesPage } from '../pages/courses/courses';
import { ForumPage } from '../pages/forum/forum';
import { DetailPostPage } from '../pages/detail-post/detail-post';
//modals
import { DetailWordModal } from '../pages/modal-detail-word/modal-detail-word';
import { LoginModal } from '../pages/modal-login/modal-login';
import { RegisterModal } from '../pages/modal-register/modal-register';
import { Popover } from '../pages/practice-write/practice-write';
//services
import { Emitter } from '../providers/rootscope-service';
import { DatabaseService } from '../providers/database-service';
import { VariableService } from '../providers/variable-service';
import { DownloadService } from '../providers/download-service';
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    NgModule({
        declarations: [
            MyApp,
            HelloIonicPage,
            ItemDetailsPage,
            ListPage,
            TestPage,
            TestDetailPage,
            TestListeningPage,
            TestReadingPage,
            TestResultPage,
            ListWordPagePage,
            PracticePage,
            PracticeListenPage,
            PracticeSpeakPage,
            PracticeWritePage,
            PracticeFlashcardPage,
            CoursesPage,
            ForumPage,
            DetailPostPage,
            DetailWordModal,
            LoginModal,
            RegisterModal,
            Popover
        ],
        imports: [
            IonicModule.forRoot(MyApp)
        ],
        bootstrap: [IonicApp],
        entryComponents: [
            MyApp,
            HelloIonicPage,
            ItemDetailsPage,
            ListPage,
            TestPage,
            TestDetailPage,
            TestListeningPage,
            TestReadingPage,
            TestResultPage,
            ListWordPagePage,
            PracticePage,
            PracticeListenPage,
            PracticeSpeakPage,
            PracticeWritePage,
            PracticeFlashcardPage,
            CoursesPage,
            ForumPage,
            DetailPostPage,
            DetailWordModal,
            LoginModal,
            RegisterModal,
            Popover
        ],
        providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Emitter, VariableService, DatabaseService, DownloadService]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map