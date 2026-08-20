<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TransparenciaController;
use App\Http\Controllers\GestaoProjetosController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('jwt.auth')->get('/me', [AuthController::class, 'me']);

Route::middleware('jwt.auth')->get('/gestao/projetos', [GestaoProjetosController::class, 'getProjetos']);

Route::get('/transparencia/projetos', [TransparenciaController::class, 'getTransparencia']);
Route::get('/transparencia/projetos/{codigo}', [TransparenciaController::class, 'getProjeto']);
Route::get('/transparencia/orgaos', [TransparenciaController::class, 'getOrgaos']);
