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

    //add this function to get the lessons
    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('sort_order', 'asc');
    }

    public function course(){
        return $this->belongsTo(Course::class);
    }
}
