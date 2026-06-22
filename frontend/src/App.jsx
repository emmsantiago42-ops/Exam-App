import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './components/Welcome';
import Navbar from './components/shared/Navbar';
import Login from './views/Login';
import Register from './views/Register';
import TeacherDashboard from './views/teacher/Dashboard';
import StudentDashboard from './views/student/Dashboard';
import CreerExamen from './views/teacher/CreerExamen';
import SuiviNotes from './views/teacher/CreerExamen';
import ExamDetails from './views/teacher/DetailExamen';
import ExamResults from './views/teacher/ExamResults';
import ExamStats from './views/student/ExamStats';
import TakeExamen from './views/student/TakeExamen';

export default function App() {
    const token = localStorage.getItem('TOKEN');
    const user = JSON.parse(localStorage.getItem('USER'));

    // Componente guardián para redirigir según el rol del usuario autenticado
    const HomeRedirect = () => {
        if (!token) {
            return <Navigate to="/login" replace />;
        }
        // Redirección inteligente basada en el rol de la base de datos
        if (user?.role === 'teacher') {
            return <Navigate to="/teacher-dashboard" replace />;
        }
        return <Navigate to="/student-dashboard" replace />;
    };

    return (
        <Router>
            <Navbar />
            <Routes>
                {/* Ruta raíz: decide a dónde ir según el estado de la sesión */}
                <Route path="/" element={<Welcome />} />

                {/* Ruta de Login: si ya está logueado, lo saca de ahí */}
                <Route path="/login" element={!token ? <Login /> : <HomeRedirect />} />

                <Route path="/register" element={!token ? <Register /> : <HomeRedirect />} />

                <Route path="/teacher-dashboard" element={token && user?.role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/login" replace />} />
                <Route path="/teacher/exams/show/:id" element={<ExamDetails />} />
                <Route path="/teacher/exams/resultats/:id" element={<ExamResults />} />
                <Route path="/teacher/creer-examen" element={token && user?.role === 'teacher' ? <CreerExamen /> : <Navigate to="/login" replace />} />
                <Route path="/teacher-suivi-notes" element={token && user?.role === 'teacher' ? <SuiviNotes /> : <Navigate to="/login" replace />} />
                <Route path="/student-dashboard" element={token && user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" replace />} />
                <Route path="/student/examens/stats/:id" element={token && user?.role === 'student' ? <ExamStats /> : <Navigate to="/login" replace />} />
                <Route path="/student/examens/faire/:id" element={token && user?.role === 'student' ? <TakeExamen /> : <Navigate to="/login" replace />} />

                {/* Redirección por defecto si meten una URL cualquiera */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}