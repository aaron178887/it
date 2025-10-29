<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            // Použijeme stejné ID jako pages (identifikační závislost)
            $table->unsignedBigInteger('id')->primary();
            
            // Cizí klíč reference na pages
            $table->foreign('id')->references('id')->on('pages')->onDelete('cascade');
            
            // Specifické atributy služby
            $table->string('category')->nullable();
            $table->text('menu_icon_svg')->nullable();
            
            // ŽÁDNÉ TIMESTAMPS!
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};