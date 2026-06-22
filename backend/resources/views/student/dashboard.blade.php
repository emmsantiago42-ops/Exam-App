@extends('layouts.app')

@include('partials.alerts')

@section('content')
<div class="container mt-5">
    <div class="row mb-4">
        <div class="col">
            <h2 class="fw-bold">🎓 Portail Etudiant</h2>
            <p class="text-muted">Selectionnez un examen pour commencer votre epreuve.</p>
        </div>
    </div>

    <div class="row">
        @forelse($examensDisp as $examen)
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <div class="card-body">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="badge bg-primary">Module</span>
                            <small class="text-muted">{{ $examen->questions_count }} Questions</small>
                        </div>
                        <h5 class="card-title fw-bold">{{ $examen->module }}</h5>
                        <p class="card-text text-secondary">
                            <i class="bi bi-calendar-event"></i> 
                            Date: {{ \Carbon\Carbon::parse($examen->date_examen)->format('d/m/Y') }}
                        </p>
                    </div>
                    <div class="card-footer bg-white border-0 pb-3">
                        @php
                            //On prepare les dates clés
                            $dateExamen = \Carbon\Carbon::parse($examen->date_examen)->timezone(config('app.timezone'));
                            $maintenant = \Carbon\Carbon::now(config('app.timezone'));

                            $ventMinAvant = $dateExamen->copy()->subMinutes(20);
                            $ventMinApres = $dateExamen->copy()->addMinutes(20);

                            $etudiantNotee = $examen->notes()->where('etudiant_id', auth()->user()->etudiant->id)->exists();
                        @endphp

                        {{-- Deja fait l'examen --}}
                        @if($etudiantNotee)
                            <button class="btn btn-secondary text-white font-weight-bold w-100" disable>
                                <i class="fas fa-check-circle"></i> Déjà fait
                            </button>

                        {{-- Il reste plus de 20 min --}}
                        @elseif($maintenant->lt($ventMinAvant))
                            <div class="alert alert-info text-center py-2 mb-0 small fw-bold">
                                <i class="bi bi-clock"></i> Disponible le {{ $dateExamen->format('d/m à H:i') }}
                            </div>
                        
                        {{-- Il reste 20 min --}}
                        @elseif($maintenant->gte($ventMinAvant) && $maintenant->lt($dateExamen))
                            <button class="btn btn-warning text-dark fw-bold w-100" disable>
                                <i class="bi bi-hourglass-split"></i> En attente de l'heure...
                            </button>

                        {{-- L'heure de l'examen est arrivée --}}
                        @elseif($maintenant->gte($dateExamen) && $maintenant->lte($ventMinApres))
                            <a href="{{ route('student.exams.take', $examen->id) }}" class="btn btn-dark w-100">
                                <i class="bi bi-pencil-square"></i>Passer l'examen
                            </a>

                        {{-- Retard --}}
                        @elseif($maintenant->gt($ventMinApres))
                            <button class="btn btn-danger text-white fw-bold w-100" disable>
                                <i class="bi bi-x-circle"></i> Examen Raté
                            </button>
                        @endif
                    </div>
                </div>
            </div>
        @empty
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    Pas d'examens disponibles en ce moment.
                </div>
            </div>
        @endforelse
    </div>
</div>
@endsection