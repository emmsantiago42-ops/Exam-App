{{-- Alerta de Error --}}
@if(session('error'))
    <div class="alert alert-danger alert-dismissible fade show d-flex align-items-center shadow-sm border-0 m-3" role="alert" id="alert-error">
        <span class="me-2 fs-5">
            <i class="bi bi-exclamation-triangle-fill"></i>
        </span>
        <div class="flex-grow-1">
            {{ session('error') }}
        </div>
        <button type="button" class="btn-close" onclick="document.getElementById('alert-error').remove();" aria-label="Close"></button>
    </div>
@endif

{{-- Alerta de Éxito / Operación correcta --}}
@if(session('success'))
    <div class="alert alert-success alert-dismissible fade show d-flex align-items-center shadow-sm border-0 m-3" role="alert" id="alert-success">
        <span class="me-2 fs-5">
            <i class="bi bi-check-circle-fill"></i>
        </span>
        <div class="flex-grow-1">
            {{ session('success') }}
        </div>
        <button type="button" class="btn-close" onclick="document.getElementById('alert-success').remove();" aria-label="Close"></button>
    </div>
@endif