<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('contact_messages', function (Blueprint $t) {
            $t->id();

            $t->string('name', 120);
            $t->string('email', 190);
            $t->text('message');
            $t->string('user_agent', 255)->nullable();

            $t->foreignId('ip_log_id')
              ->nullable()
              ->constrained('ip_logs')
              ->nullOnDelete()
              ->cascadeOnUpdate();

            $t->timestamps();

            $t->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
    }
};
