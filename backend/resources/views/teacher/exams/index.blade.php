@extends('layouts.app') {{-- O el layout que estés usando --}}

@include('partials.alerts')

@section('content')
<div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Mes Examens</h2>
        <a href="{{ route('teacher.exams.create') }}" class="btn btn-primary">Creer Nouveau Examen</a>
    </div>

    <div class="card shadow-sm">
        <div class="card-body">
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Module</th>
                        <th>Date</th>
                        <th>Questions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($examens as $examen)
                    <tr>
                        <td>{{ $examen->module }}</td>
                        <td>{{ \Carbon\Carbon::parse($examen->date_examen)->format('d/m/Y') }}</td>
                        <td><span class="badge bg-info text-dark">{{ $examen->questions->count() }}</span></td>
                        <td>
                            <a href="{{ route('teacher.exams.show', $examen->id) }}" class="btn btn-sm btn-outline-secondary">
                                <i class="bi bi-eye-fill"></i> Voir details
                            </a>
                            <a href="{{ route('teacher.exams.resultats', $examen->id) }}" class="btn btn-sm btn-outline-info" >
                                <i class="bi bi-bar-chart-fill"></i> Résultats
                            </a>
                            <form action="{{ route('teacher.exams.destroy', $examen->id) }}" method="POST" class="d-inline" onsubmit="return confirm('Vous êtes sur(e) de vouloir eliminer cet examen?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-outline-danger btn-sm">
                                <i class="bi bi-trash"></i> Éliminer
                                </button>
                            </form>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection