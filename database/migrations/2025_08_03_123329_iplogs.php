<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ip_logs', function (Blueprint $t) {
            $t->id();

            $t->string('ip', 45)->index();                // IPv4/IPv6
            $t->string('route', 100)->default('/kontakt');
            $t->boolean('success')->default(false)->index();
            $t->string('reason', 100)->nullable()->index();
            $t->string('user_agent', 255)->nullable();

            $t->timestamps();

            $t->index(['ip', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ip_logs');
    }
};
