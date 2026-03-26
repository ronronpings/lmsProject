<?php

namespace App\Models;

use App\Models\Chapter;
use Illuminate\Database\Eloquent\Model;
use App\Models\Levels;

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

    //append course small image to the course model
    // para saan to? para kapag tinawag mo yung course model, kasama na yung course small image
    protected $appends = ['course_small_image'];

    public function getCourseSmallImageAttribute(){
        if($this->image == ""){
            return "";
        }
        return asset('uploads/course/small/'.$this->image);
    }

    //set relationship to the chapter model para ma view
    public function chapters(){
        return $this->hasMany(Chapter::class);
    }

    public function level(){
        return $this->belongsTo(Levels::class);
    }
    

}
