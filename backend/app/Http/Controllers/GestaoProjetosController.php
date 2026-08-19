<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Services\GestaoProjetosService;

class GestaoProjetosController extends Controller
{
    public function __construct(private GestaoProjetosService $gestaoProjetosService) {}

    public function getProjetos(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $page = $request->query('page', 1);
        
        $filters = [];
        $orgao_id = $request->query('orgao_id');
        
        if ($orgao_id) {
            $filters['orgao_id'] = $orgao_id;
        }
        
        $status = $request->query('status');
        
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
}