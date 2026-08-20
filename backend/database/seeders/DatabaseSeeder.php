<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;
use App\Models\Orgao;
use App\Models\User;
use App\Models\Projeto;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = file_get_contents(database_path('seeders/data/dados-base.json'));
        $orgaos = json_decode($data, true);
        $this->seedOrgaos($orgaos['orgaos']);
        $this->seedUsers($orgaos['usuarios']);
        $this->seedProjetos($orgaos['projetos']);
    }

    private function seedOrgaos(array $orgaos): void
    {
        foreach ($orgaos as $orgaoData) {
            $this->upsertModel(Orgao::class, $orgaoData);
        }
    }

    private function seedUsers(array $users): void
    {
        foreach ($users as $userData) {
            $userData['password'] = Hash::make($userData['senha_demo']);
            unset($userData['senha_demo']);
            $this->upsertModel(User::class, $userData);
        }
    }

    private function seedProjetos(array $projetos): void
    {
        foreach ($projetos as $projetoData) {
            $this->upsertModel(Projeto::class, $projetoData);
        }
    }

    /**
     * Create or update a fixture while preserving its explicit primary key.
     * This makes the seeder safe to run on every container startup.
     *
     * @param class-string<\Illuminate\Database\Eloquent\Model> $modelClass
     * @param array<string, mixed> $data
     */
    private function upsertModel(string $modelClass, array $data): void
    {
        $model = $modelClass::query()->firstOrNew(['id' => $data['id'] ?? null]);
        $model->forceFill($data)->save();
    }
}
