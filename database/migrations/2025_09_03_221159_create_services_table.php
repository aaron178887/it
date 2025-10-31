<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            // Stejné ID jako pages (identifikační závislost)
            $table->unsignedBigInteger('id')->primary();
            $table->foreign('id')->references('id')->on('pages')->onDelete('cascade');
            
            // Specifické atributy služby
            $table->string('category')->nullable();
            $table->text('menu_icon_svg')->nullable();
            
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
