<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    //
    protected $fillable = [
        'course_id',
        'title',
        'sort_order',
        'status',
    ];
}
