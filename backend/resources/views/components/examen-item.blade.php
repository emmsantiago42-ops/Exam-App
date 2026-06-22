{{-- resources/views/components/examen-item.blade.php --}}
@props(['number'])

<div class="card mb-4 shadow-sm border-0">
    <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Question #{{ $number }}</h5>
    </div>
    <div class="card-body bg-white border">
        <div class="mb-3">
            <label class="form-label fw-bold">Enoncé:</label>
            <textarea name="questions[{{ $number }}][enonce]" class="form-control" rows="2" placeholder="Donner l'enoncé" required></textarea>
        </div>
        <!-- Nuevo campo para la puntuación (Note) -->
        <div class="mb-3 col-md-3">
            <label class="form-label fw-bold">Note:</label>
            <input type="number" 
                name="questions[{{ $number }}][note]" 
                class="form-control" 
                step="0.25" 
                min="0" 
                placeholder="Ej: 2.5">
        </div>

        <div class="row g-3">
            @for ($i = 0; $i < 4; $i++)
                <div class="col-md-6">
                    <div class="input-group">
                        <div class="input-group-text bg-light">
                            <input type="radio" name="questions[{{ $number }}][correct]" value="{{ $i }}" title="Marcar como correcta" required>
                        </div>
                        <input type="text" name="questions[{{ $number }}][options][{{ $i }}]" class="form-control" placeholder="Option {{ $i + 1 }}" required>
                    </div>
                </div>
            @endfor
        </div>
    </div>
</div>