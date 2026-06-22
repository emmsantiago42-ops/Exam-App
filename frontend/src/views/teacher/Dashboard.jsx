import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function DashboardTeacher() {
    const [examens, setExamens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null); // 👈 ¡Añadido! Evita que falle al eliminar un examen

    // ✨ El ÚNICO useEffect necesario al principio del componente
    useEffect(() => {
        getExamens();
    }, []);

    const getExamens = async () => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('TOKEN');
            if (!token) {
                setError("Erreur d'authentification. svp, redemarrer votre session.");
                setLoading(false);
                return;
            }
            
            const response = await api.get('/teacher/examens', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            setExamens(response.data.examens || []);
        } catch (err) {
            console.error("Error al cargar examenes:", err);
            setError('Erreur lors du chargement des examens.');
        } finally {
            setLoading(false);
        }
    };

    // (El segundo useEffect que tenías aquí abajo se ha eliminado por completo)

    // Función para el botón Éliminer
    const handleDelete = async (id) => {
        if (!window.confirm('Vous êtes sur(e) de vouloir eliminer cet examen?')) {
            return;
        }

        try {
            const token = localStorage.getItem('TOKEN');
            await api.delete(`/teacher/examens/${id}`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            
            setStatus('Examen éliminé avec succès.');
            // Lo quitamos de la lista visual sin recargar la página
            setExamens(examens.filter(exam => exam.id !== id));
        } catch (err) {
            setError("Erreur lors de l'élimination de l'examen.");
        }
    };

    // Reemplazo de Carbon en JavaScript (Formato dd/mm/aaaa)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="container mt-5 text-start">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Mes Examens</h2>
                <Link to="/teacher/creer-examen" className="btn btn-primary fw-bold">
                    Creer Nouveau Examen
                </Link>
            </div>

            {status && <div className="alert alert-success border-0 shadow-sm mb-3">{status}</div>}
            {error && <div className="alert alert-danger border-0 shadow-sm mb-3">{error}</div>}

            <div className="card shadow-sm border-0 bg-white">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="text-muted mt-2">Chargement...</p>
                        </div>
                    ) : examens.length === 0 ? (
                        <div className="text-center py-5 text-muted">Aucun examen créé.</div>
                    ) : (
                        <table className="table table-hover align-middle m-0">
                            <thead className="table-dark">
                                <tr>
                                    <th className="ps-4">Module</th>
                                    <th>Date</th>
                                    <th>Questions</th>
                                    <th className="pe-4 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {examens.map((examen) => (
                                    <tr key={examen.id}>
                                        <td className="ps-4 fw-semibold">{examen.module}</td>
                                        <td>{formatDate(examen.date_examen)}</td>
                                        <td>
                                            <span className="badge bg-info text-dark px-2 py-1">
                                                {examen.questions_count ?? 0}
                                            </span>
                                        </td>
                                        <td className="pe-4 text-end">
                                            <Link to={`/teacher/exams/show/${examen.id}`} className="btn btn-sm btn-outline-secondary me-2">
                                                Voir details
                                            </Link>
                                            <Link to={`/teacher/exams/resultats/${examen.id}`} className="btn btn-sm btn-outline-info me-2 text-dark">
                                                Résultats
                                            </Link>
                                            <button onClick={() => handleDelete(examen.id)} className="btn btn-sm btn-outline-danger">
                                                Éliminer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}