<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = [
        'etudiant_id',
        'examen_id',
        'note_calculee',
        'mention'
    ];

    public static function calculerNote($etudiantId, $examenId){
        return Reponse::where('etudiant_id', $etudiantId)
                      ->where('examen_id', $examenId)
                      ->sum('note_reponse');
    }

    public function definirMention(){
        if($this->note_calculee >= 16) return 'Très Bien';
        elseif($this->note_calculee >= 14) return 'Bien';
        elseif($this->note_calculee >= 12) return 'Assez Bien';
        elseif($this->note_calculee >= 10) return 'Passable';
        else return 'Non Validé';
    }

    public function etudiant(){
        return $this->belongsTo(Etudiant::class);
    }
}
