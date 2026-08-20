<?php

namespace App\Services;

use App\Models\Orgao;
use App\Models\Projeto;

class TransparenciaService
{
    public function __construct(private Projeto $projeto) {}
    
    public function getProjetos(int $page = 1, int $perPage = 10, ?string $situacao = null, ?int $orgao = null): array
    {
        $query = $this->projeto->query()->where('publicado', true);

        if ($situacao !== null) {
            $query->where('status', $situacao);
        }

        if ($orgao !== null) {
            $query->where('orgao_id', $orgao);
        }

        $projetos = $query
            ->with('orgao:id,nome')
            ->paginate($perPage,
                ['id', 'codigo', 'titulo', 'resumo', 'orgao_id', 'municipio', 'status', 'inicio_previsto', 'termino_previsto', 'valor_planejado', 'valor_executado', 'progresso_fisico'],
                'page', $page)
            ->through(fn (Projeto $projeto) => [
                'codigo' => $projeto->codigo,
                'titulo' => $projeto->titulo,
                'descricao' => $projeto->resumo,
                'orgao' => $projeto->orgao?->nome,
                'municipio' => $projeto->municipio,
                'situacao' => $projeto->status,
                'inicio_previsto' => $projeto->inicio_previsto,
                'termino_previsto' => $projeto->termino_previsto,
                'orcamento_previsto' => $projeto->valor_planejado,
                'valor_executado' => $projeto->valor_executado,
                'percentual_concluido' => $projeto->progresso_fisico,
            ]);

        return $projetos->toArray();
    }

    /** Return active organs that have at least one published project. */
    public function getOrgaos(): array
    {
        return Orgao::query()
            ->where('ativo', true)
            ->whereHas('projetos', fn ($query) => $query->where('publicado', true))
            ->orderBy('nome')
            ->get(['id', 'sigla', 'nome'])
            ->toArray();
    }

    /** Return a single published project using the public representation. */
    public function getProjeto(string $codigo): ?array
    {
        $projeto = $this->projeto->query()
            ->where('publicado', true)
            ->with('orgao:id,nome')
            ->where('codigo', $codigo)
            ->first();

        if ($projeto === null) {
            return null;
        }

        return [
            'codigo' => $projeto->codigo,
            'titulo' => $projeto->titulo,
            'descricao' => $projeto->resumo,
            'orgao' => $projeto->orgao?->nome,
            'municipio' => $projeto->municipio,
            'situacao' => $projeto->status,
            'inicio_previsto' => $projeto->inicio_previsto,
            'termino_previsto' => $projeto->termino_previsto,
            'orcamento_previsto' => $projeto->valor_planejado,
            'valor_executado' => $projeto->valor_executado,
            'percentual_concluido' => $projeto->progresso_fisico,
        ];
    }

    public function getResumo(): array
    {
        return [
            'projetos_publicados' => $this->countProjetos(),
            'valor_total_planejado' => $this->valorTotalPlanejado(),
            'valor_total_executado' => $this->valorTotalExecutado(),
        ];
    }

    public function lastUpdated(): ?string
    {
        $lastUpdated = $this->projeto->query()
            ->where('publicado', true)
            ->orderByDesc('atualizado_em')
            ->first();

        return $lastUpdated?->atualizado_em?->toIso8601String();
    }

    private function countProjetos(): int
    {
        return $this->projeto->query()
            ->where('publicado', true)
            ->count();
    }

    private function valorTotalPlanejado(): float
    {
        return $this->projeto->query()
            ->where('publicado', true)
            ->sum('valor_planejado');
    }

    private function valorTotalExecutado(): float
    {
        return $this->projeto->query()
            ->where('publicado', true)
            ->sum('valor_executado');
    }
}
