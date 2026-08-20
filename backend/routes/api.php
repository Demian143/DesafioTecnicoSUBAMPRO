<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TransparenciaController;
use App\Http\Controllers\GestaoProjetosController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('jwt.auth')->get('/me', [AuthController::class, 'me']);

Route::middleware('jwt.auth')->prefix('gestao')->group(function () {
    Route::get('/projetos', [GestaoProjetosController::class, 'index']);
    Route::get('/projetos/{id}', [GestaoProjetosController::class, 'show'])->whereNumber('id');
    Route::post('/projetos', [GestaoProjetosController::class, 'store']);
    Route::put('/projetos/{id}', [GestaoProjetosController::class, 'update'])->whereNumber('id');
});

Route::get('/transparencia/projetos', [TransparenciaController::class, 'getTransparencia']);
Route::get('/transparencia/projetos/{codigo}', [TransparenciaController::class, 'getProjeto']);
Route::get('/transparencia/orgaos', [TransparenciaController::class, 'getOrgaos']);
