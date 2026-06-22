{{-- resources/views/teacher/exams/create.blade.php --}}
@extends('layouts.app')

@section('content')
<div class="container py-2">
    
    {{-- TITULO DE LA PÁGINA --}}
    <div class="mb-4">
        <h1 class="display-6 fw-bold">Configuration d'un nouveau examen</h1>
        <p class="text-muted">Complétez les informations et les questions ci-dessous.</p>
    </div>

    {{-- FEEDBACK --}}
    @if (session('status'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>¡C'est fait!</strong> {{ session('status') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    {{-- INICIO DEL FORMULARIO --}}
    <form action="{{ route('teacher.exams.store') }}" method="POST">
        @csrf

        {{-- SECCIÓN 1: DATOS GENERALES --}}
        <div class="card mb-4 bg-white">
            <div class="card-body p-4">
                <h5 class="card-title fw-bold text-secondary mb-3">Détails de l'examen</h5>
                <div class="row g-3">
                    <div class="col-md-8">
                        <label class="form-label fw-bold">Module</label>
                        <input type="text" name="module" class="form-control form-control-lg" placeholder="Ex: Développement Web" required>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-bold">Date d'examen</label>
                        <input type="datetime-local" name="date_examen" class="form-control form-control-lg" required>
                    </div>
                </div>
            </div>
        </div>

        {{-- SECCIÓN 2: LAS PREGUNTAS --}}
        <div class="questions-container">
            @for ($i = 1; $i <= 4; $i++)
                <x-examen-item :number="$i" />
            @endfor
        </div>

        {{-- BOTÓN DE CIERRE --}}
        <div class="d-grid gap-2 col-md-4 mx-auto mt-5 mb-5">
            <button type="submit" class="btn btn-primary btn-lg fw-bold py-3">Soumettre l'examen</button>
        </div>
    </form>
</div>
@endsection