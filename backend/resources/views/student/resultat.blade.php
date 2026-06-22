@extends('layouts.app')

@section('content')
<div class="container mt-5 text-center">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow-lg border-0">
                <div class="card-body p-5">
                    <h1 class="display-4 mb-3">¡Examen terminé!</h1>
                    <p class="text-muted">Vous avez completé(e) le examen de: <strong>{{ $examen->module }}</strong></p>
                    
                    <div class="my-4">
                        <div class="display-1 fw-bold text-primary">
                            {{ $noteObtenu }} <span class="text-muted fs-2">/ {{ $totalPosible }}</span>
                        </div>
                        <p class="h4 mt-2">Points obtenus</p>
                    </div>

                    <div class="progress mb-4" style="height: 25px;">
                        @php $porcentaje = ($noteObtenu / $totalPosible) * 100; @endphp
                        <div class="progress-bar {{ $porcentaje >= 50 ? 'bg-success' : 'bg-danger' }}" 
                             role="progressbar" 
                             style="width: {{ $porcentaje }}%">
                             {{ round($porcentaje) }}%
                        </div>
                    </div>

                    <div class="d-grid gap-2">
                        <a href="{{ route('student.exams.index') }}" class="btn btn-outline-dark">Retourner vers mes examens</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection