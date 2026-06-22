<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Question;

class Proposition extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'libelle',
        'correcte',
        'question_id'
    ];

    public function question(){
        return $this->belongsTo(Question::class);
    }

    public function reponses(){
        return $this->hasMany(Question::class);
    }
}
