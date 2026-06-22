<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use App\Models\Examen;
use App\Models\Reponse;
use App\Models\Proposition;
use App\Models\Question;
use App\Models\Note;
use App\Models\Etudiant;

class StudentExamController extends Controller
{
    public function index(Request $request){
        $user = $request->user();
        $etudiant = $user->etudiant;

        if(!$etudiant) {
            return response()->json(['message' => 'Profil étudiant non trouvé.'], 403);
        }

        $examensDisp = Examen::withCount('questions')->get();

        $maintenant = \Carbon\Carbon::now(config('app.timezone'));

        foreach($examensDisp as $examen){
            $dateExamen = \Carbon\Carbon::parse($examen->date_examen)->timezone(config('app.timezone'));
        
            $limiteRetard = $dateExamen->copy()->addMinutes(20);
            if($maintenant->gt($limiteRetard)){
                $dejaFait = Note::where('examen_id', $examen->id)
                        ->where('etudiant_id', $etudiant->id)
                        ->exists();
                if(!$dejaFait){
                    $noteCalculee = 0.00;
                    \App\Models\Note::create([
                        'examen_id' => $examen->id,
                        'etudiant_id' => $etudiant->id,
                        'note_calculee' => $noteCalculee,
                        'mention' => (new Note(['note_calculee' => $noteCalculee]))->definirMention()
                    ]);
                }
            }  
        }

        $resultat = $examensDisp->map(function ($examen) use ($etudiant) {
            $dejaNote = Note::where('examen_id', $examen->id)
                ->where('etudiant_id', $etudiant->id)
                ->exists();
            
            return [
                'id' => $examen->id,
                'module' => $examen->module,
                'date_examen' => $examen->date_examen,
                'questions_count' => $examen->questions_count,
                'deja_fait' => $dejaNote,
            ];
        });
      
        return response()->json([
            'examensDisp' => $resultat
        ], 200); 
    }

    public function take(Request $request, Examen $examen): JsonResponse {
        // 1. Avoir l'ID de l'etudiant en question
        $user = $request->user();
        $etudiant = $user->etudiant;

        if(!$etudiant) {
            return response()->json(['message' => 'Profil étudiant non trouvé.'], 403);
        }

        // 2. Verifier s'il a deja fait cet examen
        $dejaFait = Note::where('examen_id', $examen->id)
                        ->where('etudiant_id', $etudiant->id)
                        ->exists();

        if($dejaFait) {
            return response()->json([
                'status' => 'already_done',
                'message' => 'Vous avez déjà passé cet examen!!'
            ], 400);
        }

        $dateExamen = Carbon::parse($examen->date_examen)->timezone(config('app.timezone'));
        $maintenant = Carbon::now(config('app.timezone'));
        $limiteRetard = $dateExamen->copy()->addMinutes(20);

        if($maintenant->gt($limiteRetard)){
            $noteCalculee = 0.00;
            Note::create([
                'examen_id' => $examen->id,
                'etudiant_id' => $etudiant->id,
                'note_calculee' => $noteCalculee,
                'mention' => (new Note(['note_calculee' => $noteCalculee]))->definirMention()
            ]);

            return response()->json([
                'status' => 'later',
                'message' => 'Vous êtes arrivé(e) en retard !! Note zéro enregistrée.'
            ], 400);
        }

        $examen->load(['questions.propositions', 'professeur.user']);

        return response()->json([
            'status' => 'success',
            'examen' => [
                'id' => $examen->id,
                'module' => $examen->module,
                'date_examen' => $examen->date_examen,
                'professeur_name' => $examen->professeur->user->name ?? 'Enseignant',
                'questions' => $examen->questions->map(function($q) {
                    return [
                        'id' => $q->id,
                        'enonce' => $q->enonce,
                        'note' => $q->note,
                        'propositions' => $q->propositions->map(function($p) {
                            return [
                                'id' => $p->id,
                                'libelle' => $p->libelle
                            ];
                        })
                    ];
                })
            ]
        ], 200);
    }

    public function submit(Request $request, Examen $examen) {
        // 1. Identificar al estudiante (Temporalmente el primero hasta tener Login)
        $user = $request->user();
        $etudiant = $user->etudiant;

        if(!$etudiant) {
            return response()->json(['message' => 'Profil étudiant non trouvé.'], 403);
        }

        $dateExamen = Carbon::parse($examen->date_examen)->timezone(config('app.timezone'));
        $maintenant = Carbon::now(config('app.timezone'));
        $limiteRetard = $dateExamen->copy()->addMinutes(20);

        if($maintenant->gt($limiteRetard)){
            $noteCalculee = 0.00;
            Note::create([
                'examen_id' => $examen->id,
                'etudiant_id' => $etudiant->id,
                'note_calculee' => $noteCalculee,
                'mention' => (new Note(['note_calculee' => $noteCalculee]))->definirMention()
            ]);

            return response()->json([
                'status' => 'later',
                'message' => "Sumission d'examen en retard !! Note zéro enregistrée."
            ], 400);
        }

        $reponsesInput = $request->input('reponses', []); // El array [question_id => prop_id]

        // 2. Delegamos el guardado de cada respuesta al modelo Reponse
        foreach ($reponsesInput as $questionId => $propositionId) {
            Reponse::create([
                'etudiant_id'    => $etudiant->id,
                'examen_id'      => $examen->id,
                'question_id'    => $questionId,
                'proposition_id' => $propositionId
            ]);
        }

        // 3. ¡AQUÍ ESTÁ LA MAGIA! Llamamos al método que definimos en el Modelo Note
        // Ya no repetimos el bucle ni los IF de comparación aquí.
        $noteCalculee = Note::calculerNote($etudiant->id, $examen->id);

        // 4. Creamos el registro del Resultado (RésultatÉtudiant)
        $resultat = Note::create([
            'etudiant_id'   => $etudiant->id,
            'examen_id'     => $examen->id,
            'note_calculee' => $noteCalculee,
            'mention'       => (new Note(['note_calculee' => $noteCalculee]))->definirMention()
        ]);

        $totalPosible = $examen->questions->sum('note');

        // 5. Devolvemos la vista con el objeto Note ya creado
        return response()->json([
            'status' => 'success',
            'noteObtenu' => $resultat->note_calculee,
            'mention' => $resultat->mention,
            'totalPosible' => $totalPosible
        ], 200);
    }

    public function stats(Request $request, Examen $examen): JsonResponse{
        $etudiant = $request->user()->etudiant;

        // Buscamos la nota guardada de este examen
        $note = Note::where('examen_id', $examen->id)
                            ->where('etudiant_id', $etudiant->id)
                            ->firstOrFail();

        return response()->json([
            'noteObtenu'   => $note->note_calculee,
            'mention'      => $note->mention,
            'totalPosible' => $examen->questions()->sum('note')
        ], 200);
    }
}
