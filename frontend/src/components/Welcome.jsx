import React from 'react';
import { Link, Navigate } from 'react-router-dom';

export default function Welcome() {
    // Si el usuario ya está logueado, lo mandamos directo al dashboard
    const isAuthenticated = !!localStorage.getItem('TOKEN');
    if (isAuthenticated) {
        return <Navigate to="/teacher-dashboard" />;
    }

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
            <div className="card shadow-lg border-0 p-5 bg-white" style={{ maxWidth: '600px' }}>
                <div className="mb-4">
                    <span className="fs-1">🎓</span>
                </div>
                <h1 className="fw-bold text-dark mb-3">Portail d'Examens</h1>
                <p className="text-secondary mb-5" style={{ fontSize: '1.1rem' }}>
                    Bienvenue sur la plateforme officielle de gestion et de passage d'examens. 
                    Veuillez vous connecter pour accéder a votre espace ou créer un nouveau compte si vous n'en avez pas encore.
                </p>

                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                    {/* Botón de Login */}
                    <Link to="/login" className="btn btn-dark btn-lg px-4 fw-bold shadow-sm">
                        Se connecter
                    </Link>
                    
                    {/* Botón de Registro */}
                    <Link to="/register" className="btn btn-outline-secondary btn-lg px-4 fw-bold shadow-sm">
                        S'inscrire
                    </Link>
                </div>
            </div>
            <p className="text-muted mt-5" style={{ fontSize: '0.85rem' }}>
                &copy; {new Date().getFullYear()} Portail Examens. Tous droits réservés.
            </p>
        </div>
    );
}