<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            PagesSeeder::class,
            ServiceSeeder::class,
            ReferenceSeeder::class, 
            AdminUserSeeder::class,
        ]);
    }
}
