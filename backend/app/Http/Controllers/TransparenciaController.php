<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\TransparenciaService;

class TransparenciaController extends Controller
{
    public function __construct(private TransparenciaService $transparenciaService) {}

    public function getTransparencia(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'situacao' => ['sometimes', 'string', 'in:planejado,em_andamento,suspenso,concluido'],
            'orgao' => ['sometimes', 'integer', 'exists:orgaos,id'],
        ]);

        $projetos = $this->transparenciaService->getProjetos(
            $filters['page'] ?? 1,
            $filters['per_page'] ?? 10,
            $filters['situacao'] ?? null,
            $filters['orgao'] ?? null,
        );

        $data = [ 
            'ultima_atualizacao' => $this->transparenciaService->lastUpdated(),
            'resumo' => $this->transparenciaService->getResumo(),
            'filtros_aplicados' => array_intersect_key($filters, array_flip(['situacao', 'orgao'])),
            'dados' => $projetos,
        ];
        return response()->json($data);
    }

    public function getOrgaos(): JsonResponse
    {
        return response()->json([
            'dados' => $this->transparenciaService->getOrgaos(),
        ]);
    }
}
