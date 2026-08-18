<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projetos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('codigo')->unique();
            $table->string('titulo');
            $table->text('resumo');
            $table->foreignId('orgao_id')->references('id')->on('orgaos')->onDelete('cascade');
            $table->foreignId('responsavel_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('municipio');
            $table->boolean('status');
            $table->date('inicio_previsto');
            $table->date('termino_previsto');
            $table->double('valor_planejado');
            $table->double('valor_exeutado');
            $table->integer('progresso_fisico');
            $table->boolean('publicado');
            $table->text('nota_interna');
            $table->timestamp('criado_em')->useCurrent();
            $table->timestamp('atualizado_em')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projeto');
    }
};
