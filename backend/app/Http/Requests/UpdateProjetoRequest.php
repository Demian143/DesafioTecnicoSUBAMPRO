<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjetoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'codigo' => ['sometimes', 'string', 'max:255', Rule::unique('projetos', 'codigo')->ignore($id)],
            'titulo' => ['sometimes', 'string', 'max:255'],
            'resumo' => ['sometimes', 'string'],
            'orgao_id' => ['sometimes', 'integer', 'exists:orgaos,id'],
            'responsavel_id' => ['sometimes', 'integer', 'exists:users,id'],
            'municipio' => ['sometimes', 'string', 'max:255'],
            'status' => ['sometimes', 'in:planejado,em_andamento,suspenso,concluido'],
            'inicio_previsto' => ['sometimes', 'date'],
            'termino_previsto' => ['sometimes', 'date'],
            'valor_planejado' => ['sometimes', 'numeric', 'min:0'],
            'valor_executado' => ['sometimes', 'numeric', 'min:0'],
            'progresso_fisico' => ['sometimes', 'integer', 'between:0,100'],
            'publicado' => ['sometimes', 'boolean'],
            'nota_interna' => ['nullable', 'string'],
        ];
    }
}
