<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'info@itglobe.eu')],
            [
                'name'     => env('ADMIN_NAME', 'Admin'),
                'password' => env('ADMIN_PASSWORD', 'change-me'),
            ]
        );
    }
}
