import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function StudentDashboard() {
    const [examensDisp, setExamensDisp] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    // 1. Efecto para traer los exámenes desde Laravel
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const token = localStorage.getItem('TOKEN');
                const response = await api.get('/student/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                // Esperamos que Laravel nos envíe la lista en response.data.examensDisp
                setExamensDisp(response.data.examensDisp || response.data);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger les examens.");
            } finally {
                setLoading(false);
            }
        };

        fetchExams();

        // ⏱️ Actualizamos la hora del cliente cada segundo para que los botones cambien en tiempo real
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 🎯 Lógica de tiempos traducida de tu Blade (Carbon -> JS Date)
    const renderExamFooter = (examen) => {
        const dateExamen = new Date(examen.date_examen);
        
        const ventMinAvant = new Date(dateExamen.getTime() - 20 * 60 * 1000);
        const ventMinApres = new Date(dateExamen.getTime() + 20 * 60 * 1000);

        // Si tu backend te envía un flag boleano de si ya fue completado
        if (examen.deja_fait) {
            return (
                <button className="btn btn-secondary text-white fw-bold w-100" disabled>
                    <i className="bi bi-check-circle-fill me-2"></i> Déjà fait
                </button>
            );
        }

        // Caso: Falta más de 20 minutos
        if (currentTime < ventMinAvant) {
            const opciones = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' };
            return (
                <div className="alert alert-info text-center py-2 mb-0 small fw-bold">
                    <i className="bi bi-clock me-2"></i> Disponible le {dateExamen.toLocaleDateString('fr-FR', opciones)}
                </div>
            );
        }

        // Caso: Quedan menos de 20 minutos para que empiece
        if (currentTime >= ventMinAvant && currentTime < dateExamen) {
            return (
                <button className="btn btn-warning text-dark fw-bold w-100" disabled>
                    <i className="bi bi-hourglass-split me-2"></i> En attente de l'heure...
                </button>
            );
        }

        // Caso: Ventana de tiempo activa (Hora exacta hasta +20 mins de tolerancia)
        if (currentTime >= dateExamen && currentTime <= ventMinApres) {
            return (
                <Link to={`/student/examens/faire/${examen.id}`} className="btn btn-dark w-100 fw-bold">
                    <i className="bi bi-pencil-square me-2"></i> Passer l'examen
                </Link>
            );
        }

        // Caso: Pasaron los 20 minutos de tolerancia (Retard)
        if (currentTime > ventMinApres) {
            return (
                <button className="btn btn-danger text-white fw-bold w-100" disabled>
                    <i className="bi bi-x-circle me-2"></i> Examen Raté
                </button>
            );
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-dark" role="status"></div></div>;
    if (error) return <div className="alert alert-danger mt-4 text-start">{error}</div>;

    return (
        <div className="container mt-5 text-start">
            <div className="row mb-4">
                <div className="col">
                    <h2 className="fw-bold">🎓 Portail Étudiant</h2>
                    <p className="text-muted">Sélectionnez un examen pour commencer votre épreuve.</p>
                </div>
            </div>

            <div className="row">
                {examensDisp.length > 0 ? (
                    examensDisp.map((examen) => (
                        <div className="col-md-4 mb-4" key={examen.id}>
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="badge bg-primary px-2 py-1" style={{ fontSize: '0.75rem' }}>Module</span>
                                        <small className="text-muted fw-bold">{examen.questions_count || 0} Questions</small>
                                    </div>
                                    <h5 className="card-title fw-bold text-dark mt-2">{examen.module}</h5>
                                    <p className="card-text text-secondary small">
                                        <i className="bi bi-calendar-event me-2"></i> 
                                        Date: {new Date(examen.date_examen).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                                <div className="card-footer bg-white border-0 pb-3">
                                    {renderExamFooter(examen)}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <div className="alert alert-info border-0 shadow-sm">
                            Pas d'examens disponibles en ce moment.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}