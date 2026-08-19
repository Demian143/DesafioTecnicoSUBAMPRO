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
            Orgao::forceCreate($orgaoData);
        }
    }

    private function seedUsers(array $users): void
    {
        foreach ($users as $userData) {
            $userData['password'] = Hash::make($userData['senha_demo']);
            unset($userData['senha_demo']);
            User::forceCreate($userData);
        }
    }

    private function seedProjetos(array $projetos): void
    {
        foreach ($projetos as $projetoData) {
            Projeto::forceCreate($projetoData);
        }
    }
}