<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test System - {{ config('app.name') }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; height: 100vh; display: flex; align-items: center; }
        .card-portal { transition: transform 0.3s; cursor: pointer; text-decoration: none; color: inherit; }
        .card-portal:hover { transform: translateY(-10px); }
    </style>
</head>
<body>

<div class="container text-center">
    <h1 class="mb-5 fw-bold text-primary">Sistema de Exámenes - Panel de Pruebas</h1>
    
    <div class="row justify-content-center g-4">
        <div class="col-md-4">
            <a href="{{ route('exams.index') }}" class="card card-portal shadow border-0 h-100">
                <div class="card-body p-5">
                    <div class="display-3 mb-3">👨‍🏫</div>
                    <h3 class="card-title">Portal Profesor</h3>
                    <p class="text-muted">Crear exámenes, gestionar preguntas y ver notas de alumnos.</p>
                    <span class="btn btn-primary mt-3">Entrar como Profe</span>
                </div>
            </a>
        </div>

        <div class="col-md-4">
            <a href="{{ route('student.exams.index') }}" class="card card-portal shadow border-0 h-100">
                <div class="card-body p-5 border-bottom border-5 border-success rounded">
                    <div class="display-3 mb-3">🎓</div>
                    <h3 class="card-title">Portal Estudiante</h3>
                    <p class="text-muted">Ver exámenes disponibles, responder pruebas y ver resultados.</p>
                    <span class="btn btn-success mt-3">Entrar como Alumno</span>
                </div>
            </a>
        </div>
    </div>

    <div class="mt-5 p-3 bg-white shadow-sm rounded">
        <p class="mb-0 text-muted small">
            <strong>Modo Debug:</strong> Laragon está activo en <code>localhost:8000</code>. 
            Base de Datos: <code>demo_app</code>.
        </p>
    </div>
</div>

</body>
</html>