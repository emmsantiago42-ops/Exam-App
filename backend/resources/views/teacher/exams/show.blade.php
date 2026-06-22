@extends('layouts.app')

@section('content')
<div class="container mt-5">
    <div class="mb-4">
        <a href="{{ route('teacher.exams.index') }}" class="btn btn-outline-secondary">← Retourner vers la liste</a>
        <h2 class="mt-3">Examen: {{ $examen->module }}</h2>
        <p class="text-muted">Date: {{ \Carbon\Carbon::parse($examen->date_examen)->format('d/m/Y') }}</p>
    </div>

    @foreach($examen->questions as $index => $question)
    <div class="card mb-4 shadow-sm">
        <div class="card-header bg-dark text-white">
            <strong>Question #{{ $index + 1 }}</strong> ({{ $question->note }} pts)
        </div>
        <div class="card-body">
            <p class="fw-bold">{{ $question->enonce }}</p>
            
            <ul class="list-group">
                @foreach($question->propositions as $prop)
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    {{ $prop->libelle }}
                    @if($prop->correcte)
                        <span class="badge bg-success">Correcte ✅</span>
                    @endif
                </li>
                @endforeach
            </ul>
        </div>
    </div>
    @endforeach
</div>
@endsection