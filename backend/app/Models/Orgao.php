<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nome', 'sigla', 'ativo'])]
class Orgao extends Model
{
    public function usuarios(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function projetos(): HasMany
    {
        return $this->hasMany(Projeto::class);
    }
}
