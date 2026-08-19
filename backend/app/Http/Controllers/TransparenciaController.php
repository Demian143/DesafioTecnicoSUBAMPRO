<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Services\TransparenciaService;

class TransparenciaController extends Controller
{
    public function __construct(private TransparenciaService $transparenciaService) {}

    public function getTransparencia(Request $request): JsonResponse
    {
        $projetos = $this->transparenciaService->getProjetos(
            $request->query('page', 1),
            $request->query('per_page', 10)
        );

        $data = [ 
            'ultima_atualizacao' => $this->transparenciaService->lastUpdated(),
            'resumo' => $this->transparenciaService->getResumo(),
            'dados' => $projetos,
        ];
        return response()->json($data);
    }
}
