import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
    const navigate = useNavigate();
    
    // Estados para capturar los datos del nuevo usuario
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [role, setRole] = useState('student'); // Por defecto se registra como estudiante
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validación básica de contraseñas en el frontend
        if (password !== passwordConfirmation) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        setLoading(true);

        try {
            // Petición POST a la ruta de registro de tu API de Laravel
            const response = await api.post('/register', {
                name: name,
                email: email,
                password: password,
                password_confirmation: passwordConfirmation,
                role: role
            });

            alert('Compte créé avec succès ! Veuillez vous connecter.');
            
            // Redireccionamos limpiamente al Login usando el enrutador de React
            navigate('/login');

        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || "Erreur lors de l'inscription.");
            } else {
                setError('Impossible de contacter le serveur.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100 text-start">
            <div className="card shadow-sm border-0 p-4" style={{ width: '450px', backgroundColor: '#fff' }}>
                <h3 className="text-center mb-4 fw-bold text-dark">Créer un compte</h3>
                
                {error && (
                    <div className="alert alert-danger d-flex align-items-center py-2" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <div style={{ fontSize: '0.9rem' }}>{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-secondary fw-bold" style={{ fontSize: '0.85rem' }}>Nom complet</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-secondary fw-bold" style={{ fontSize: '0.85rem' }}>Adresse Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-secondary fw-bold" style={{ fontSize: '0.85rem' }}>Je suis un(e)</label>
                        <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="student">Étudiant</option>
                            <option value="teacher">Enseignant (Professeur)</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-secondary fw-bold" style={{ fontSize: '0.85rem' }}>Mot de passe</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-secondary fw-bold" style={{ fontSize: '0.85rem' }}>Confirmer le mot de passe</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-dark w-100 fw-bold py-2 mb-3"
                        disabled={loading}
                    >
                        {loading ? 'Inscription en cours...' : "S'inscrire"}
                    </button>

                    <div className="text-center">
                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>Vous avez déjà un compte ? </span>
                        <Link to="/login" className="text-dark fw-bold" style={{ fontSize: '0.9rem' }}>Se connecter</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}