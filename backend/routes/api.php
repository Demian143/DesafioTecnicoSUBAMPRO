<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TransparenciaController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('jwt.auth')->get('/me', [AuthController::class, 'me']);

Route::get('/transparencia/projetos', [TransparenciaController::class, 'getTransparencia']);