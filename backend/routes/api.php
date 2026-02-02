<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BadgeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn (Request $request) => $request->user());

    Route::get('/users/{user}/achievements', [BadgeController::class, 'show']);
    Route::get('/badges', [BadgeController::class, 'index']);
});
