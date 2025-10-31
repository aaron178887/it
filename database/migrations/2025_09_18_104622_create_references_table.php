<?php
// database/migrations/2024_01_01_000000_create_references_table.php
// (použij svoje timestamp jméno souboru – důležité je, že tu NENÍ is_published)
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('references', function (Blueprint $table) {
            $table->id();

            $table->string('logo')->nullable();      
            $table->string('logo_alt')->nullable(); 

            $table->string('title', 160);       
            $table->text('description');          
            $table->string('tag', 160)->nullable();  

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('references');
    }
};
