@extends('layouts.app')

@include('partials.alerts')

@section('content')
<div class="container mt-5">
    <div class="row mb-4 align-items-center">
        <div class="col">
            <h2 class="fw-bold">📊 Résultats de l'Examen</h2>
            <p class="text-muted">Module : <span class="text-dark fw-bold">{{ $examen->module }}</span></p>
        </div>
        <div class="col-text-end">
            <a href="{{ route('teacher.exams.index') }}" class="btn btn-outline-secondary">
                <i class="bi bi-arrow-left"></i> Retour
            </a>
        </div>
    </div>

    <div class="card shadow-sm border-0">
        <div class="card-body p-0">
            <table class="table table-hover table-striped mb-0 align-middle">
                <thead class="table-dark">
                    <tr>
                        <th class="ps-4">Nom & Prénom</th>
                        <th>Email</th>
                        <th>Note</th>
                        <th class="pe-4">Mention</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($notes as $note)
                        <tr>
                            <td class="ps-4 fw-bold">{{ $note->etudiant->user->name }}</td>
                            <td>{{ $note->etudiant->user->email }}</td>
                            <td>
                                <span class="badge {{ $note->note_calculee >= 10 ? 'bg-success' : 'bg-danger' }} fs-6">
                                    {{ number_format($note->note_calculee, 2) }} / 20
                                </span>
                            </td>
                            <td class="pe-4">
                                @if($note->note_calculee >= 16)
                                    <span class="text-success fw-bold">Très Bien</span>
                                @elseif($note->note_calculee >= 14)
                                    <span class="text-info fw-bold">Bien</span>
                                @elseif($note->note_calculee >= 12)
                                    <span class="text-primary fw-bold">Assez Bien</span>
                                @elseif($note->note_calculee >= 10)
                                    <span class="text-secondary fw-bold">Passable</span>
                                @else
                                    <span class="text-danger fw-bold">Ajourné (Échec)</span>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="text-center text-muted py-4">
                                <i class="bi bi-info-circle fs-4 d-block mb-2"></i>
                                Aucun étudiant n'a todavía de note pour cet examen.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection