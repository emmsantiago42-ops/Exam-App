<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Teacher\ExamController;
use App\Http\Controllers\Student\StudentExamController;

// 🌐 Ruta pública para iniciar sesión desde React
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [RegisteredUserController::class, 'store']);

// 🔒 Rutas protegidas por Token
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/teacher/examens', [ExamController::class, 'index']);
    Route::get('/teacher/examens/{examen}', [ExamController::class, 'show']);
    Route::get('/teacher/examens/{examen}/resultats', [ExamController::class, 'resultats']);
    Route::post('/teacher/examens', [ExamController::class, 'store']);
    Route::delete('/teacher/examens/{examen}', [ExamController::class, 'destroy']);

    Route::get('/student/dashboard', [StudentExamController::class , 'index']);
    Route::get('/student/examens/faire/{examen}', [StudentExamController::class , 'take']);
    Route::post('/student/examens/envoyer/{examen}', [StudentExamController::class , 'submit']);
    Route::post('/student/examens/stats/{examen}', [StudentExamController::class , 'stats']);
});