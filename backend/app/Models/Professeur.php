<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Departement;
use App\Models\Examen;

class Professeur extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tel',
        'd_prise_fonct',
        'departement_id'
    ];

    public function examens(){
        return $this->hasMany(Examen::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function departement(){
        return $this->belongsTo(Departement::class);
    }
}
