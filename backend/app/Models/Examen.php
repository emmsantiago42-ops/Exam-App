<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Professeur;
use App\Models\Question;

class Examen extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'module',
        'code_ex',
        'date_examen',
        'professeur_id'
    ];

    public function professeur(){
        return $this->belongsTo(Professeur::class);
    }

    public function questions() {
        return $this->hasMany(Question::class);
    }

    public function notes() {
        return $this->hasMany(Note::class);
    }
}
