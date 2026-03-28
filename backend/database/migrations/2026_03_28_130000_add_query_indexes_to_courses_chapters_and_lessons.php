<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            if (! Schema::hasIndex('courses', ['status', 'is_featured'])) {
                $table->index(['status', 'is_featured'], 'courses_status_is_featured_index');
            }

            if (! Schema::hasIndex('courses', 'created_at')) {
                $table->index('created_at', 'courses_created_at_index');
            }
        });

        Schema::table('chapters', function (Blueprint $table) {
            if (! Schema::hasIndex('chapters', ['course_id', 'sort_order'])) {
                $table->index(['course_id', 'sort_order'], 'chapters_course_id_sort_order_index');
            }
        });

        Schema::table('lessons', function (Blueprint $table) {
            if (! Schema::hasIndex('lessons', ['chapter_id', 'sort_order'])) {
                $table->index(['chapter_id', 'sort_order'], 'lessons_chapter_id_sort_order_index');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            if (Schema::hasIndex('lessons', 'lessons_chapter_id_sort_order_index')) {
                $table->dropIndex('lessons_chapter_id_sort_order_index');
            }
        });

        Schema::table('chapters', function (Blueprint $table) {
            if (Schema::hasIndex('chapters', 'chapters_course_id_sort_order_index')) {
                $table->dropIndex('chapters_course_id_sort_order_index');
            }
        });

        Schema::table('courses', function (Blueprint $table) {
            if (Schema::hasIndex('courses', 'courses_created_at_index')) {
                $table->dropIndex('courses_created_at_index');
            }

            if (Schema::hasIndex('courses', 'courses_status_is_featured_index')) {
                $table->dropIndex('courses_status_is_featured_index');
            }
        });
    }
};
