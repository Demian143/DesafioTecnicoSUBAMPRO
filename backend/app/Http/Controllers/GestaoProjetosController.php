<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjetoRequest;
use App\Http\Requests\UpdateProjetoRequest;
use Illuminate\Http\Request;
use App\Services\GestaoProjetosService;

class GestaoProjetosController extends Controller
{
    public function __construct(private GestaoProjetosService $gestaoProjetosService) {}

    public function index(Request $request)
    {
        $filtersInput = $request->validate([
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'orgao_id' => ['sometimes', 'integer', 'exists:orgaos,id'],
            'status' => ['sometimes', 'string', 'in:planejado,em_andamento,suspenso,concluido'],
        ]);

        $perPage = $filtersInput['per_page'] ?? 10;
        $page = $filtersInput['page'] ?? 1;
        
        $filters = [];
        $orgao_id = $filtersInput['orgao_id'] ?? null;
        
        if ($orgao_id) {
            $filters['orgao_id'] = $orgao_id;
        }
        
        $status = $filtersInput['status'] ?? null;
        
        if ($status) {
            $filters['status'] = $status;
        }
        // Como o filtro busca não foi definido em qual coluna ele deve ser aplicado, vou deixar para futuras melhorias
        // Falta contexto na doc sufuiciente para definir a coluna correta para o filtro de busca
        $projetos = $this->gestaoProjetosService->getProjetos($perPage, $page, $filters);

        return response()->json([
            'filtros_aplicados' => $filters,
            'data' => $projetos
        ]);
    }

    public function show(int $id)
    {
        return response()->json([
            'data' => $this->gestaoProjetosService->getProjeto($id),
        ]);
    }

    public function store(StoreProjetoRequest $request)
    {
        $projeto = $this->gestaoProjetosService->criarProjeto($request->validated());

        return response()->json(['data' => $projeto], 201);
    }

    public function update(UpdateProjetoRequest $request, int $id)
    {
        $projeto = $this->gestaoProjetosService->atualizarProjeto($id, $request->validated());

        return response()->json(['data' => $projeto]);
    }
}
