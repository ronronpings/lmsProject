<?php

use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\CourseController;
use App\Http\Controllers\front\OutcomeController;
use App\Http\Controllers\front\RequirementController;
use App\Http\Controllers\front\ChapterController;
use App\Http\Controllers\front\LessonController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AccountController::class, 'register']);
Route::post('/login', [AccountController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/courses', [CourseController::class, 'store']);
    //show and retrive data on select
    Route::get('/courses/meta-data', [CourseController::class, 'retrieve']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::put('/courses/update/{id}', [CourseController::class, 'update']);
    //course image
    Route::post('/save-course-image/{id}', [CourseController::class, 'saveCourseImage']);
    Route::post('/publish-course/{id}', [CourseController::class, 'publishCoursechangeStatus']);

    
    //outcomes
    Route::get('/outcomes', [OutcomeController::class, 'index']);
    Route::post('/outcomes', [OutcomeController::class, 'store']);
    Route::put('/outcomes/{id}', [OutcomeController::class, 'update']);
    Route::delete('/outcomes/{id}', [OutcomeController::class, 'destroy']);
    Route::post('/sort-outcomes', [OutcomeController::class, 'sortOutcomes']);

    //requirements
    Route::get('/requirements', [RequirementController::class, 'index']);
    Route::post('/requirements', [RequirementController::class, 'store']);
    Route::put('/requirements/{id}', [RequirementController::class, 'update']);
    Route::delete('/requirements/{id}', [RequirementController::class, 'destroy']);
    Route::post('/sort-requirements', [RequirementController::class, 'sortRequirements']);

    //chapters
    Route::get('/chapters', [ChapterController::class, 'index']);
    Route::post('/chapters', [ChapterController::class, 'store']);
    Route::put('/chapters/{id}', [ChapterController::class, 'update']);
    Route::delete('/chapters/{id}', [ChapterController::class, 'destroy']);
    Route::post('/sort-chapters', [ChapterController::class, 'sortChapters']);

    //Lesson
    Route::post('/lessons', [LessonController::class, 'store']);
    Route::put('/lessons/{id}', [LessonController::class, 'update']);
    Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
    Route::get('/lessons/{id}', [LessonController::class, 'show']);
    Route::post('/save-lesson-video/{id}', [LessonController::class, 'saveLessonVideo']);
    Route::post('/sort-lessons', [LessonController::class,'sortLessons']);
    Route::post('/sort-chapters', [LessonController::class,'sortChapters']);

});
   
