import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../../api';

export default function ExamStats() {
    const { id } = useParams();
    const location = useLocation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // 💡 Si venimos directo del envío del examen, los datos ya vienen en el "state" de la navegación
        if (location.state) {
            setStats(location.state);
            setLoading(false);
        } else {
            // 🔄 Si el alumno recargó la página (F5), se los pedimos limpiamente a la API
            const fetchStats = async () => {
                try {
                    const token = localStorage.getItem('TOKEN');
                    const response = await api.get(`/student/exams/stats/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setStats(response.data);
                } catch (err) {
                    console.error(err);
                    setError("Impossible de charger les stat de cet examen.");
                } finally {
                    setLoading(false);
                }
            };
            fetchStats();
        }
    }, [id, location.state]);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-dark" role="status"></div></div>;
    if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
    if (!stats) return null;

    const porcentaje = (stats.noteObtenu / stats.totalPosible) * 100;

    return (
        <div className="container mt-5 text-center pb-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg border-0">
                        <div className="card-body p-5">
                            <h1 className="display-4 mb-3 fw-bold text-dark">¡Examen terminé!</h1>
                            <p className="text-muted">Vous avez complété(e) l'épreuve avec succès.</p>
                            
                            <div className="my-4">
                                <div className="display-1 fw-bold text-dark">
                                    {stats.noteObtenu} <span className="text-muted fs-2">/ {stats.totalPosible}</span>
                                </div>
                                <p className="h4 mt-2 text-secondary fw-bold">Points obtenus</p>
                                {stats.mention && (
                                    <span className="badge bg-light text-dark border px-3 py-2 mt-1 fw-bold fs-6">
                                        Mention: {stats.mention}
                                    </span>
                                )}
                            </div>

                            <div className="progress mb-4" style={{ height: '25px' }}>
                                <div 
                                    className={`progress-bar progress-bar-striped progress-bar-animated ${porcentaje >= 50 ? 'bg-success' : 'bg-danger'}`} 
                                    role="progressbar" 
                                    style={{ width: `${porcentaje}%` }}
                                >
                                    {Math.round(porcentaje)}%
                                </div>
                            </div>

                            <div className="d-grid gap-2">
                                <Link to="/student-dashboard" className="btn btn-outline-dark fw-bold py-2">
                                    Retourner vers mes examens
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}