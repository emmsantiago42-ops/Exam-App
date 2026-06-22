<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Examen;
use App\Models\Proposition;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'enonce',
        'note',
        'examen_id'
    ];

    public function examen(){
        return $this->belongsTo(Examen::class);
    }

    public function propositions() {
        return $this->hasMany(Proposition::class);
    }
}
