<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    //
     protected $appends = ['video_url'];

    public function getVideoUrlAttribute(){
        if($this->video == ""){
            return "";
        }
        return asset('uploads/course/videos/'.$this->video);
    }




    protected $fillable = [
        'title',
        'course_id',
        'chapter_id',
        'video',
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
