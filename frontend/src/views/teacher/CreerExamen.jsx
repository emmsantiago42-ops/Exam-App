import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function CreerExamen() {
    const [module, setModule] = useState('');
    const [dateExamen, setDateExamen] = useState('');
    
    // Estructura idéntica a lo que pide tu transacción en Laravel
    const [questions, setQuestions] = useState(
        Array.from({ length: 4 }, (_, index) => ({
            id: index +1,
            note: 5,
            enonce: '',
            options: { a: '', b: '', c: '', d: ''},
            correct: 'a'
        }))
    );

    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEnonceChange = (id, value) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, enonce: value } : q));
    };

    const handleOptionChange = (id, optionKey, value) => {
        setQuestions(questions.map(q => {
            if (q.id === id) {
                return { ...q, options: { ...q.options, [optionKey]: value } };
            }
            return q;
        }));
    };

    const handleCorrectChange = (id, optionKey) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, correct: optionKey } : q));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('TOKEN');
            
            const payload = {
                module: module,
                date_examen: dateExamen,
                questions: questions
            };

            await api.post('/teacher/examens', payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setStatus('Examen créé correctement!!');
            setModule('');
            setDateExamen('');
            // Resetear formulario
            setQuestions([
                { id: 1, enonce: '', note: 5, options: { a: '', b: '', c: '', d: '' }, correct: 'a' },
                { id: 2, enonce: '', note: 5, options: { a: '', b: '', c: '', d: '' }, correct: 'a' },
                { id: 3, enonce: '', note: 5, options: { a: '', b: '', c: '', d: '' }, correct: 'a' },
                { id: 4, enonce: '', note: 5, options: { a: '', b: '', c: '', d: '' }, correct: 'a' }
            ]);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur de communication avec le serveur.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="display-6 fw-bold m-0">Configuration de l'examen</h1>
                    <p className="text-muted m-0">Gestion des modules et propositions (QCM).</p>
                </div>
                <Link to="/teacher-dashboard" className="btn btn-outline-secondary px-3">← Retour</Link>
            </div>

            {status && <div className="alert alert-success shadow-sm border-0 mb-4"><strong>¡C'est fait!</strong> {status}</div>}
            {error && <div className="alert alert-danger shadow-sm border-0 mb-4"><strong>Attention :</strong> {error}</div>}

            <form onSubmit={handleSubmit}>
                {/* DATOS GENERALES */}
                <div className="card mb-4 bg-white border-0 shadow-sm">
                    <div className="card-body p-4">
                        <h5 className="card-title fw-bold text-secondary mb-3">Détails de l'examen</h5>
                        <div className="row g-3">
                            <div className="col-md-8">
                                <label className="form-label fw-bold">Module</label>
                                <input type="text" className="form-control form-control-lg" value={module} onChange={(e) => setModule(e.target.value)} placeholder="Ex: Développement Web" required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Date d'examen</label>
                                <input type="datetime-local" className="form-control form-control-lg" value={dateExamen} onChange={(e) => setDateExamen(e.target.value)} required />
                            </div>
                        </div>
                    </div>
                </div>

                {/* PREGUNTAS Y PROPOSICIONES */}
                <div>
                    <h5 className="fw-bold text-secondary mb-3 px-2">Questions & Propositions (QCM)</h5>
                    {questions.map((question) => (
                        <div className="card mb-4 border-0 shadow-sm border-start border-primary border-4" key={question.id}>
                            <div className="card-body p-4">
                                <div className="mb-3">
                                    <label className="form-label fw-bold text-dark">Question {question.id}</label>
                                    <textarea className="form-control mb-3" rows="2" value={question.enonce} onChange={(e) => handleEnonceChange(question.id, e.target.value)} placeholder="Énoncé..." required />
                                </div>

                                {/* Listado de Opciones A, B, C, D */}
                                <div className="bg-light p-3 rounded">
                                    <p className="small fw-bold text-muted mb-2">Propositions (Cochez la case de la réponse correcte) :</p>
                                    {['a', 'b', 'c', 'd'].map((key) => (
                                        <div className="input-group mb-2" key={key}>
                                            <div className="input-group-text bg-white">
                                                <input 
                                                    type="radio" 
                                                    name={`correct-${question.id}`} 
                                                    checked={question.correct === key} 
                                                    onChange={() => handleCorrectChange(question.id, key)}
                                                    className="form-check-input mt-0" 
                                                />
                                                <span className="ms-2 text-uppercase fw-bold text-secondary small">{key}.</span>
                                            </div>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={question.options[key]} 
                                                onChange={(e) => handleOptionChange(question.id, key, e.target.value)} 
                                                placeholder={`Option ${key.toUpperCase()}`} 
                                                required={key === 'a' || key === 'b'} // Obligatorias al menos las dos primeras opciones
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="d-grid gap-2 col-md-4 mx-auto mt-5 mb-5">
                    <button type="submit" className="btn btn-primary btn-lg fw-bold py-3 shadow-sm" disabled={loading}>
                        {loading ? 'Sauvegarde...' : "Enregistrer"}
                    </button>
                </div>
            </form>
        </div>
    );
}