<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    //
    protected $fillable = [
    'title',
    'user_id',
    'category_id',
    'level_id',
    'language_id',
    'description',
    'price',
    'cross_price',
    'status',
    'is_featured',
    'image',
];

}
