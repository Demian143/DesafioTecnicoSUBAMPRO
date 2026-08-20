<?php

namespace App\Services;

use App\Models\Projeto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GestaoProjetosService {
    public function __construct(private Projeto $projeto) {}

    public function getProjetos(int $perPage, int $page, array $filters = []): LengthAwarePaginator
    {
        $query = $this->projeto->query();

        foreach ($filters as $column => $value) {
            $query->where($column, $value);
        }

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function getProjeto(int $id): Projeto
    {
        return $this->projeto->query()->findOrFail($id);
    }

    public function criarProjeto(array $data): Projeto
    {
        return $this->projeto->query()->create($data);
    }

    public function atualizarProjeto(int $id, array $data): Projeto
    {
        $projeto = $this->getProjeto($id);
        $projeto->fill($data);
        $projeto->save();

        return $projeto->refresh();
    }
}
