import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

export default function TakeExamen() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [examen, setExamen] = useState(null);
    const [reponses, setReponses] = useState({}); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false); // 🎯 Estado de envío declarado

    useEffect(() => {
        const fetchExamenDetails = async () => {
            try {
                const token = localStorage.getItem('TOKEN');
                const response = await api.get(`/student/examens/faire/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setExamen(response.data.examen);
            } catch (err) {
                console.error(err);
                if (err.response && err.response.data) {
                    setError(err.response.data.message);
                } else {
                    setError("Impossible de charger les détails de l'examen.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchExamenDetails();
    }, [id]);

    const handleRadioChange = (questionId, propositionId) => {
        setReponses({
            ...reponses,
            [questionId]: propositionId
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('TOKEN');
            const response = await api.post(`/student/examens/envoyer/${id}`, {
                reponses: reponses
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.status === 'success') {
                // 🎯 REDIRECCIÓN CORREGIDA: Apunta a la ruta física que lee tu App.jsx
                navigate(`/student/examens/stats/${id}`, { state: response.data });
            }
        } catch (err) {
            console.error(err);
            setError("Une erreur est survenue lors de l'envoi de l'examen.");
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
    
    if (error) return (
        <div className="container mt-4 text-start">
            <div className="alert alert-danger shadow-sm border-0 d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <div>{error}</div>
            </div>
            <button className="btn btn-dark fw-bold mt-2" onClick={() => navigate('/student-dashboard')}>
                Retour au Tableau de Bord
            </button>
        </div>
    );

    if (!examen) return null;

    return (
        <div className="container mt-5 text-start pb-5">
            
            {/* CABECERA: Fondo oscuro elegante para romper el blanco dominante */}
            <div className="card shadow-sm border-0 bg-dark text-white p-4 mb-5 rounded-3">
                <div className="d-flex align-items-center mb-2">
                    <h1 className="fw-bold h2 m-0">Module: {examen.module}</h1>
                </div>
                <hr className="border-secondary my-3" />
                <div className="d-flex flex-wrap gap-4 border-0 bg-dark small fw-medium text-white">
                    <div><i className="bi bi-calendar3 me-1 text-primary"></i> Date: {new Date(examen.date_examen).toLocaleDateString('fr-FR')}</div>
                    <div><i className="bi bi-person-badge me-1 text-primary"></i> Enseignant: {examen.professeur_name}</div>
                    <div><i className="bi bi-card-list me-1 text-primary"></i> {examen.questions?.length || 0} Questions au total</div>
                </div>
            </div>

            {/* FORMULARIO DE PREGUNTAS */}
            <form onSubmit={handleSubmit}>
                <div className="row g-4">
                    {examen.questions?.map((question, index) => (
                        <div className="col-md-6" key={question.id}>
                            {/* TARJETA DE PREGUNTA: Borde izquierdo de color para dar contraste */}
                            <div className="card h-100 shadow-sm border-0 border-start border-5 border-dark p-4 rounded-3 bg-white">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1.5 fw-bold rounded-pill">
                                        Question {index + 1}
                                    </span>
                                    <span className="badge bg-light text-muted border fw-bold px-2.5 py-1.5">{question.note} pts</span>
                                </div>
                                
                                <h5 className="fw-bold text-dark lh-base mb-4" style={{ minHeight: '50px' }}>
                                    {question.enonce}
                                </h5>

                                <div className="d-flex flex-column gap-2">
                                    {question.propositions?.map((proposition) => {
                                        const isChecked = reponses[question.id] === proposition.id;
                                        return (
                                            <label 
                                                key={proposition.id} 
                                                className={`d-flex align-items-center p-3 rounded border transition-all ${
                                                    isChecked 
                                                        ? 'border-primary bg-primary-subtle bg-opacity-25 text-primary-emphasis fw-medium' 
                                                        : 'border-light-subtle bg-light bg-opacity-50 text-secondary'
                                                }`}
                                                style={{ cursor: 'pointer', transition: '0.2s ease-in-out' }}
                                            >
                                                <input 
                                                    type="radio" 
                                                    name={`reponses[${question.id}]`} 
                                                    value={proposition.id} 
                                                    checked={isChecked}
                                                    onChange={() => handleRadioChange(question.id, proposition.id)}
                                                    className="form-check-input mt-0 border-secondary-subtle" 
                                                    style={{ width: '1.2rem', height: '1.2rem' }}
                                                    required
                                                    disabled={submitting}
                                                />
                                                <span className="ms-3 small">
                                                    {proposition.libelle}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* BOTÓN DE ACCIÓN PRINCIPAL */}
                <div className="mt-5 d-flex justify-content-end">
                    <button 
                        type="submit" 
                        className="btn btn-dark fw-bold px-5 py-3 shadow rounded-3 text-uppercase tracking-wider"
                        disabled={submitting}
                        style={{ letterSpacing: '0.5px' }}
                    >
                        {submitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Envoi en cours...
                            </>
                        ) : (
                            "Terminer et soumettre"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}