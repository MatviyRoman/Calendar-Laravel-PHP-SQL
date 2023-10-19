<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CalenderController;
use App\Http\Controllers\FAQController;
use Illuminate\Support\Facades\Artisan;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [CalenderController::class, 'home'])->name('home');
Route::get('/calendar', [CalenderController::class, 'index'])->name('calendar');
Route::get('/calendar/filter', [CalenderController::class, 'filter'])->name('calendar.filter');
Route::post('/calendar/ajax', [CalenderController::class, 'ajax'])->name('calendar.ajax');

Route::get('/events', [CalenderController::class, 'events'])->name('events');
Route::get('/faq', [FAQController::class, 'index'])->name('faq');

Route::post('/seed-database', function () {
    // Run the db:seed command
    Artisan::call('db:seed');

    return response()->json(['message' => 'Database seeded successfully']);
})->name('seed');
