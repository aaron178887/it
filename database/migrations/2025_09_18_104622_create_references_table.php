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

            $table->string('logo')->nullable();      // např. /images/references/client-logo1.svg
            $table->string('logo_alt')->nullable();  // alt text loga

            $table->string('title', 160);            // „E-shop v cloudu“
            $table->text('description');             // odstavec pod názvem
            $table->string('tag', 160)->nullable();  // např. „Kubernetes“

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('references');
    }
};
