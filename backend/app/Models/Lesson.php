<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    //
    protected $fillable = [
        'title',
        'course_id',
        'chapter_id',
        'video_url',
        'video_type',
        'duration',
        'status',
        'sort_order',
        'is_free_preview',
        'description'
    ];

    public function chapter(){
        return $this->belongsTo(Chapter::class);
    }
}
