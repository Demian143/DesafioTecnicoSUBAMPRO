<?php

namespace App\Services;

use App\Models\Projeto;

class GestaoProjetosService {
    public function __construct(private Projeto $projeto) {}

    public function getProjetos($perPage, $page, array $filters = [])
    {
        $query = $this->projeto->query();

        foreach ($filters as $column => $value) {
            $query->where($column, $value);
        }

        return $query->paginate($perPage, ['*'], 'page', $page);
    }
}