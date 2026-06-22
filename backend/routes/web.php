<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Student\StudentExamController;
use App\Http\Controllers\Teacher\ExamController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    $user = auth()->user();
    if($user->role === 'teacher') {
            return redirect()->route('teacher.exams.index');
        }

    if($user->role === 'student') {
        return redirect()->route('student.exams.index');
    }
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'role:teacher'])->prefix('professeur')->name('teacher.')->group(function(){
    Route::get('/examens', [ExamController::class, 'index'])->name('exams.index');
    Route::get('/examens/creer', [ExamController::class, 'create'])->name('exams.create');
    Route::post('/examens/garder', [ExamController::class, 'store'])->name('exams.store');
    Route::get('/examens/{examen}', [ExamController::class, 'show'])->name('exams.show');
    Route::delete('/examens/{examen}', [ExamController::class, 'destroy'])->name('exams.destroy');
    Route::get('/examens/{examen}/resultats', [ExamController::class, 'resultats'])->name('exams.resultats');
});

Route::middleware(['auth', 'role:student'])->prefix('etudiant')->name('student.')->group(function(){
    Route::get('/dashboard', [StudentExamController::class , 'index'])->name('exams.index');
    Route::get('/examens/{examen}/faire', [StudentExamController::class , 'take'])->name('exams.take');
    Route::post('/examens/{examen}/envoyer', [StudentExamController::class , 'submit'])->name('exams.submit');
});

require __DIR__.'/auth.php';
