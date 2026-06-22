import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api'; // Tu instancia configurada de Axios

export default function ExamDetails() {
    const { id } = useParams(); // Recupera el ID dinámico desde la URL (/teacher/exams/show/:id)
    const [examen, setExamen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExamDetails = async () => {
            try {
                const token = localStorage.getItem('TOKEN');
                
                const response = await api.get(`/teacher/examens/${id}`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                
                setExamen(response.data.examen);
            } catch (err) {
                console.error(err);
                const status = err.response.status;
                const message = err.response.data?.message;
                setError(status + ', '+ message);
            } finally {
                setLoading(false);
            }
        };

        fetchExamDetails();
    }, [id]);

    // Adaptación idéntica a tu formato de Carbon en JS
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2">Chargement des détails de l'examen...</p>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger m-5 border-0 shadow-sm">{error}</div>;
    }

    return (
        <div className="container mt-5 text-start">
            <div className="mb-4">
                {/* Navegación fluida de React sin recargar página completa */}
                <Link to="/teacher-dashboard" className="btn btn-outline-secondary">
                    ← Retourner vers la liste
                </Link>
                <h2 className="mt-3">Examen: {examen?.module}</h2>
                <p className="text-muted">Date: {formatDate(examen?.date_examen)}</p>
            </div>

            {/* Renderizado de las preguntas (@foreach de Blade) */}
            {examen?.questions?.map((question, index) => (
                <div className="card mb-4 shadow-sm border-0 bg-white" key={question.id}>
                    <div className="card-header bg-dark text-white fw-bold">
                        Question #{index + 1} ({question.note} pts)
                    </div>
                    <div className="card-body">
                        <p className="fw-bold">{question.enonce}</p>
                        
                        <ul className="list-group">
                            {/* Renderizado de las opciones */}
                            {question.propositions?.map((prop) => (
                                <li className="list-group-item d-flex justify-content-between align-items-center" key={prop.id}>
                                    {prop.libelle}
                                    {prop.correcte === 1 && (
                                        <span className="badge bg-success px-2 py-1">Correcte ✅</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}