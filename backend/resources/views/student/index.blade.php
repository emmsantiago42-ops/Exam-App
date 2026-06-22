@extends('layouts.app') @section('content')
<div class="container py-5">
    
    <div class="card shadow-sm border-0 mb-4 mx-auto" style="max-width: 500px;">
        <div class="card-body p-4 text-center">
            <h5 class="card-title font-weight-bold mb-3">Rejoindre un Examen</h5>
            
            <form action="{{ route('student.exams.join') }}" method="POST" class="d-flex gap-2">
                @csrf
                <input type="text" name="code_ex" placeholder="Ex: EX-9832" required
                       class="form-control text-center font-weight-bold uppercase" style="letter-spacing: 2px;">
                <button type="submit" class="btn btn-dark font-weight-bold px-4">
                    Valider le code
                </button>
            </form>
        </div>
    </div>

</div>
@endsection