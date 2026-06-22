<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reponse extends Model
{
    protected $fillable = [
        'etudiant_id',
        'examen_id',
        'question_id',
        'proposition_id',
        'note_reponse'
    ];

    protected static function booted() {
        parent::booted();
        static::creating(function($reponse){
            $prop = Proposition::find($reponse->proposition_id);
            if($prop && $prop->correcte == 1) {
                $reponse->note_reponse = $reponse->question->note;
            } else { $reponse->note_reponse = 0; }
        });
    }

    public function proposition() {
        return $this->belongsTo(Proposition::class);
    }

    public function question() {
        return $this->belongsTo(Question::class);
    }
}
