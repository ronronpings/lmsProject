<?php

namespace Database\Seeders;

use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
         $categories = [
            'English',
            'Filipino',
            'Spanish',
            'Fresh',
        ];
         foreach ($categories as $category) {
            DB::table('languages')->updateOrInsert(
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
