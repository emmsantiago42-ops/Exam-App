import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login() {
    // 1. Estados para capturar los datos del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 2. Función que procesa el inicio de sesión
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Usamos la configuración centralizada de la API
            const response = await api.post('/login', {
                email: email,
                password: password
            });

            const token = response.data.access_token;
            const user = response.data.user;

            localStorage.setItem('TOKEN', token);
            localStorage.setItem('USER', JSON.stringify(user));

            alert(`¡Bienvenu(e), ${user.name}!`);

            if (user.role === 'teacher') {
                window.location.href = '/teacher-dashboard';
            } else {
                window.location.href = '/student-dashboard';
            }

        } catch (err) {
            console.error(err);
    
            if (err.response) {
                // El servidor está activo pero respondió con un código de error (4xx, 5xx)
                const status = err.response.status;
                const message = err.response.data?.message;

                if (status === 401) {
                    setError(" Identifiants incorrects. Veuillez réessayer.");
                } else if (status === 422) {
                    setError("Veuillez remplir correctement todos los campos.");
                } else {
                    setError(message || `Erreur du serveur (${status}).`);
                }

            } else if (err.request) {
                // La petición se hizo pero el servidor backend está completamente apagado
                setError(" Impossible de contacter le serveur.");

            } else {
                // Error de configuración interna de Axios u otro problema
                setError(`Erreur de configuration: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-sm border-0 p-4" style={{ width: '400px', backgroundColor: '#fff' }}>
                <h3 className="text-center mb-4 fw-bold text-dark">Portail Éxamens</h3>
                
                {error && (
                    <div className="alert alert-danger d-flex align-items-center py-2" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <div style={{ fontSize: '0.9rem' }}>{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-secondary" style={{ fontSize: '0.85rem fw-bold' }}>Adresse Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-secondary" style={{ fontSize: '0.85rem fw-bold' }}>Mot de passe</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-dark w-100 fw-bold py-2"
                        disabled={loading}
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>

                    <div className="text-center">
                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>Vous n'avez pas de compte ? </span>
                        <Link to="/register" className="text-dark fw-bold" style={{ fontSize: '0.9rem' }}>S'inscrire</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}