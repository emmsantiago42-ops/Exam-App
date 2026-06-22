<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): View
    {
        return view('auth.register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'string', 'in:student,teacher'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        if($user->role === 'teacher') {
            \App\Models\Professeur::create([
                'user_id' => $user->id,
                'tel' => '',
                'd_prise_fonct' => now(),
                'departement_id' => 1,
            ]);
        } elseif($user->role === 'student'){
            \App\Models\Etudiant::create([
                'user_id' => $user->id,
                'code_et' => '',
            ]);
        }

        // event(new Registered($user));

        // Auth::login($user);

        return response()->json([
            'status' => 'succes',
            'message' => 'Utilisateur enregistré avec succès !',
            'user' => $user
        ], 201);
    }
}
