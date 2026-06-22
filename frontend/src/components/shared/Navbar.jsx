import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    
    // Recuperamos los datos del usuario y el token guardados en el login
    const token = localStorage.getItem('TOKEN');
    const userRaw = localStorage.getItem('USER'); 
    const user = userRaw ? JSON.parse(userRaw) : null;

    const handleLogout = () => {
        // On nettoie le stockage local
        localStorage.clear();
        // Redirection vers login
        window.location.replace('/');
    };

    if (!token || !user) return null;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-5 shadow-sm text-start">
            <div className="container">
                {/* Título dinámico según el rol idéntico a tu Blade */}
                <Link className="navbar-brand fw-bold" to="#">
                    {user.role === 'teacher' && "Portail Enseignant"}
                    {user.role === 'student' && "Portail Étudiant"}
                    {user.role !== 'teacher' && user.role !== 'student' && "Dashboard"}
                </Link>

                <div className="navbar-nav ms-auto align-items-center">
                    {/* Saludo personalizado */}
                    <span className="nav-link text-light me-3">
                        Bonjour, {user.name}
                    </span>
                    
                    {/* Botón de Déconnexion interactivo */}
                    <button 
                        onClick={handleLogout} 
                        className="btn btn-outline-light btn-sm"
                    >
                        Déconnexion
                    </button>
                </div>
            </div>
        </nav>
    );
}