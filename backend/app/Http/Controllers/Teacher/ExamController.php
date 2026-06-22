<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Examen;
use App\Models\Professeur;
use App\Models\Question;
use App\Models\Proposition;
use Illuminate\Support\Facades\DB;

class ExamController extends Controller
{
    public function create(){
        return view('teacher.exams.create');
    }

    public function index(){
        try {
            // 1. Obtenemos el usuario autenticado a través del token que envía React
            $user = auth()->user();
            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'Non authentifié.'], 401);
            }

            // 2. Buscamos el perfil del profesor asignado a ese usuario
            $professeur = Professeur::where('user_id', $user->id)->first();
            if (!$professeur) {
                return response()->json(['status' => 'error', 'message' => 'Profil professeur introuvable.'], 404);
            }

            // 3. Traemos únicamente los exámenes de ESTE profesor con su contador de preguntas
            $examens = Examen::where('professeur_id', $professeur->id)
                         ->withCount('questions')
                         ->orderBy('date_examen', 'desc')
                         ->get();

            return response()->json([
                'status' => 'success',
                'examens' => $examens
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur interne: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request){
        $professeur = Professeur::where('user_id',auth()->id())->first();
        if(!$professeur){
            return response()->json([
                'status' => 'error',
                'message' => 'Pas de professeur associé a ce compte.'
            ], 403);
        }

        $request->validate([
            'module' => 'required|string|max:255',
            'date_examen' => 'required|date',
            'questions' => 'required|array'
        ]);

        try {
            \DB::transaction(function() use ($request, $professeur) {
                $examen = Examen::create([
                    'module' => $request->module,
                    'code_ex' => '',
                    'date_examen' => $request->date_examen,
                    'professeur_id' => $professeur->id
                ]);

                foreach($request->questions as $index => $data){
                
                    $question = $examen->questions()->create([
                        'enonce'=>$data['enonce'],
                        'note'=>$data['note'] ?? 0
                    ]);

                    foreach($data['options'] as $key => $libelle){
                        if(empty($libelle)) continue;
                        $question->propositions()->create([
                            'libelle'=>$libelle,
                            'correcte'=>($data['correct'] == $key) ? 1 : 0
                        ]);
                    }
                }
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Examen créé correctement!!'
            ], 201);
        } catch(\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la creations: !!' . $e->getMessage()
            ], 500);
        }
    }

    public function show(Examen $examen){
        try {
            $professeur = \App\Models\Professeur::where('user_id', auth()->id())->firstOrFail();
            if($examen->professeur_id !== $professeur->id){
                return response()->json([
                    'status' => 'error',
                    'message' => 'Action non autorisée'
                ], 403);
            }

            $examen->load('questions.propositions');

            return response()->json([
                'status' => 'success',
                'examen' => $examen
            ], 200);
        } catch(\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => 'Fail interne de Laravel: !!' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Examen $examen)
{
    try {
        // 🔒 SEGURIDAD: Validamos que el examen pertenezca al profesor autenticado
        $professeur = \App\Models\Professeur::where('user_id', auth()->id())->firstOrFail();
        if ($examen->professeur_id !== $professeur->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Action non autorisée.'
            ], 403);
        }

        // 1. Obtenemos todos los IDs de las preguntas de este examen
        $questionIds = $examen->questions()->pluck('id')->toArray();

        if (!empty($questionIds)) {
            // 2. Obtenemos todos los IDs de las opciones (propositions) vinculadas a esas preguntas
            $propositionIds = \DB::table('propositions')
                ->whereIn('question_id', $questionIds)
                ->pluck('id')
                ->toArray();

            if (!empty($propositionIds)) {
                // 3. ¡Primero la raíz! Borramos todas las respuestas de los alumnos que usaron esas opciones
                \DB::table('reponses')->whereIn('proposition_id', $propositionIds)->delete();

                // 4. Borramos todas las opciones (propositions) de esas preguntas
                \DB::table('propositions')->whereIn('question_id', $questionIds)->delete();
            }

            // 5. Borramos todas las preguntas del examen
            \DB::table('questions')->whereIn('examen_id', [$examen->id])->delete();
        }

        // 6. Borramos las notas vinculadas a este examen
        $examen->notes()->delete();

        // 7. Finalmente, borramos el examen principal libre de ataduras
        $examen->delete();

        // 🎯 RETORNO API: En lugar de redirect, devolvemos éxito en JSON
        return response()->json([
            'status' => 'success',
            'message' => 'Examen et toutes ses données associés ont été supprimés avec succès !'
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Erreur lors de la suppression: ' . $e->getMessage()
        ], 500);
    }
}

    public function resultats(Examen $examen){
        try {
            $professeur = \App\Models\Professeur::where('user_id', auth()->id())->firstOrFail();
            if($examen->professeur_id !== $professeur->id){
                return response()->json([
                    'status' => 'error',
                    'message' => 'Action non autorisée'
                ], 403);
            }

            // On cherce les notes avec les données de l'etudiant et utilisateur 
            $notes = $examen->notes()->with('etudiant.user')->get();

            return response()->json([
                'status' => 'success',
                'examen' => $examen,
                'notes' => $notes
            ], 200);
        } catch(\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur serveur: ' . $e->getMessage()
            ], 500);
        }
    }
}
