<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['codigo', 'titulo', 'resumo', 'orgao_id', 'responsavel_id', 'municipio', 'status', 'inicio_previsto', 'termino_previsto', 'valor_planejado', 'valor_executado', 'progresso_fisico', 'publicado', 'nota_interna'])]
class Projeto extends Model
{
    public const CREATED_AT = 'criado_em';

    public const UPDATED_AT = 'atualizado_em';

    public function orgao(): BelongsTo
    {
        return $this->belongsTo(Orgao::class);
    }

    public function responsavel(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responsavel_id');
    }
}
