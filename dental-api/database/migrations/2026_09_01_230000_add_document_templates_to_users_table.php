<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('prescription_template_path')->nullable()->after('avatar_path');
            $table->string('invoice_template_path')->nullable()->after('prescription_template_path');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['prescription_template_path', 'invoice_template_path']);
        });
    }
};
