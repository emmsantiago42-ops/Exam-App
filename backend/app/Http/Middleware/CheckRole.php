<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // 1. si l'utlisateur n'a pas initier session
        if(!auth()->check()) { return redirect()->route('login'); }

        // 2. Si le role de la BDD ne coincide pas avec ce de la route...
        if(auth()->user()->role !== $role) {
            return redirect('/dashboard')->with('error', 'Accès interdit. Portail réservé.');
        }

        // 3. si tout est correct
        return $next($request);
    }
}
