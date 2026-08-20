<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjetoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'codigo' => ['required', 'string', 'max:255', Rule::unique('projetos', 'codigo')],
            'titulo' => ['required', 'string', 'max:255'],
            'resumo' => ['required', 'string'],
            'orgao_id' => ['required', 'integer', 'exists:orgaos,id'],
            'responsavel_id' => ['required', 'integer', 'exists:users,id'],
            'municipio' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:planejado,em_andamento,suspenso,concluido'],
            'inicio_previsto' => ['required', 'date'],
            'termino_previsto' => ['required', 'date', 'after_or_equal:inicio_previsto'],
            'valor_planejado' => ['required', 'numeric', 'min:0'],
            'valor_executado' => ['required', 'numeric', 'min:0'],
            'progresso_fisico' => ['required', 'integer', 'between:0,100'],
            'publicado' => ['required', 'boolean'],
            'nota_interna' => ['nullable', 'string'],
        ];
    }
}
