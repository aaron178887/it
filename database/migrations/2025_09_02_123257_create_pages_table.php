<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('data')->nullable();     // všechny společné informace
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            // malé tabulky nepotřebují další indexy
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};