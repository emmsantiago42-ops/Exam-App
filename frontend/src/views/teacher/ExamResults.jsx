import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';

export default function ExamResults() {
    const { id } = useParams(); // Captura el ID del examen desde la URL
    const [examen, setExamen] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem('TOKEN');
                const response = await api.get(`/teacher/examens/${id}/resultats`, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                
                setExamen(response.data.examen);
                setNotes(response.data.notes || []);
            } catch (err) {
                console.error(err);
                const status = err.response.status;
                const message = err.response.data?.message;
                setError(status + ', '+ message);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [id]);

    // Función equivalente a la lógica de menciones en Blade
    const renderMention = (note) => {
        if (note >= 16) return <span className="text-success fw-bold">Très Bien</span>;
        if (note >= 14) return <span className="text-info fw-bold">Bien</span>;
        if (note >= 12) return <span className="text-primary fw-bold">Assez Bien</span>;
        if (note >= 10) return <span className="text-secondary fw-bold">Passable</span>;
        return <span className="text-danger fw-bold">Ajourné (Échec)</span>;
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2">Chargement des résultats...</p>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger m-5 border-0 shadow-sm">{error}</div>;
    }

    return (
        <div className="container mt-5 text-start">
            <div className="row mb-4 align-items-center">
                <div className="col">
                    <h2 className="fw-bold">📊 Résultats de l'Examen</h2>
                    <p className="text-muted">Module : <span className="text-dark fw-bold">{examen?.module}</span></p>
                </div>
                <div className="col text-end">
                    <Link to="/teacher-dashboard" className="btn btn-outline-secondary">
                        Retour
                    </Link>
                </div>
            </div>

            <div className="card shadow-sm border-0 bg-white">
                <div className="card-body p-0">
                    {notes.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            Aucun étudiant n'a encore de note pour cet examen.
                        </div>
                    ) : (
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th className="ps-4">Nom & Prénom</th>
                                    <th>Email</th>
                                    <th>Note</th>
                                    <th className="pe-4">Mention</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notes.map((item) => (
                                    <tr key={item.id}>
                                        <td className="ps-4 fw-bold">
                                            {item.etudiant?.user?.name || 'Étudiant inconnu'}
                                        </td>
                                        <td>{item.etudiant?.user?.email || '-'}</td>
                                        <td>
                                            <span className={`badge ${item.note_calculee >= 10 ? 'bg-success' : 'bg-danger'} fs-6`}>
                                                {parseFloat(item.note_calculee).toFixed(2)} / 20
                                            </span>
                                        </td>
                                        <td className="pe-4">
                                            {renderMention(item.note_calculee)}
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