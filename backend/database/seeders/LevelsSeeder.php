<?php

namespace Database\Seeders;

use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LevelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $categories = [
            'Advanced',
            'Intermediate',
            'Expert',
            'Beginner',
        ];

        foreach ($categories as $category) {
            DB::table('levels')->updateOrInsert(
                ['name' => $category],
                [
                    'status' => 1,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
         }
    }
}
