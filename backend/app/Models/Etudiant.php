<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    protected $fillable = ['user_id', 'code_et'];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function notes(){
        return $this->hasMany(Note::class);
    }
}
