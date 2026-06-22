<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validation des donnees qui arrivent depuis React
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Recherche de l'utilisateur dans la bdd
        $user = User::where('email', $request->email)->first();

        // 3. Verification de l'existence et le mdp
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Les identifiants sont incorrects.'
            ], 401); // 401 = No autorizado
        }

        // 4. Generation du token en se basant sur son role
        $token = $user->createToken('auth_token')->plainTextToken;

        // 5. Reponse vers React avec le token et les donnees de l'utlisateur
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role, // Muy útil para que React sepa qué panel mostrar
            ]
        ], 200);
    }

    public function logout(Request $request)
    {
        // Efface le token utilisé par l'utilisateur
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie !'
        ], 200);
    }
}