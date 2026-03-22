<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Outcome extends Model
{
    //
    protected $fillable = [
        "course_id",
        "text",
        "sort_order",
    ];
}
