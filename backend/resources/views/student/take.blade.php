@extends('layouts.app')

@include('partials.alerts')

<script src="https://cdn.tailwindcss.com"></script>

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
        <h1 class="text-3xl font-bold text-gray-950 mb-3">{{ $examen->module }}</h1>
        <div class="flex flex-wrap gap-4 text-sm text-gray-600">
            <div class="flex items-center">
                <span class="font-semibold text-gray-800 mr-1">Date:</span> 
                {{ \Carbon\Carbon::parse($examen->date)->format('d/m/Y') }}
            </div>
            <div class="flex items-center">
                <span class="font-semibold text-gray-800 mr-1">Professeur:</span> 
                {{ $examen->professeur->user->name ?? 'Enseignant' }}
            </div>
            <div class="flex items-center">
                <span class="font-semibold text-gray-800 mr-1">Questions:</span> 
                {{ $examen->questions->count() }}
            </div>
        </div>
    </div>

    <form action="{{ route('student.exams.submit', $examen->id) }}" method="POST">
        @csrf

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @foreach($examen->questions as $index => $question)
                <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-start mb-4">
                            <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                Question {{ $index + 1 }}
                            </span>
                            <span class="text-sm text-gray-500 font-medium">{{ $question->note }} pts</span>
                        </div>
                        
                        <h3 class="text-lg font-bold text-gray-950 mb-4">
                            {{ $question->enonce }}
                        </h3>

                        <div class="space-y-3">
                            @foreach($question->propositions as $proposition)
                                <label class="flex items-center p-3 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer border border-gray-200 transition-colors">
                                    <input type="radio" 
                                           name="reponses[{{ $question->id }}]" 
                                           value="{{ $proposition->id }}" 
                                           class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" required>
                                    <span class="ml-3 text-sm text-gray-700">
                                        {{ $proposition->libelle }}
                                    </span>
                                </label>
                            @endforeach
                        </div>
                    </div>
                </div>
            @endforeach
        </div>

        <div class="mt-8 flex justify-end">
            <button type="submit" class="bg-gray-950 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg shadow transition-colors">
                Soumettre l'examen
            </button>
        </div>
    </form>
</div>
@endsection