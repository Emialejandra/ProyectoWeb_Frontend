import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/landing.css";;
import G1 from "../../assets/controlG1.jpg";
import G2 from "../../assets/controlG2.jpg";
import G3 from "../../assets/controlG3.jpg";
import G4 from "../../assets/controlG4.png";
import G7 from "../../assets/controlG7.png";
import G8 from "../../assets/controlG8.jpg";
import G6 from "../../assets/controlG6.jpg";

//carrusel de imagenes 
const images = [G1, G2, G3, G4, G7, G8, G6];

function Landing() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="landing">
            <header className="landing-header">
                <div className="logo">
                    <h2>Sistema de control de Gastos</h2>
                </div>

                <nav className="nav-buttons">
                    <Link to="/home">
                        <button className="btn-login-header">
                            Iniciar Sesión
                        </button>
                    </Link>

                    <Link to="/register">
                        <button className="btn-register-header">
                            Registrarse
                        </button>
                    </Link>
                </nav>
            </header>

            <section className="hero">
                <div className="hero-content">
                    <h1>Control de Gastos</h1>

                    <p>
                        Sistema Web para el control de gastos personal,
                        implememntado con inteligencia artifial.
                        Todo lo que puedes necesitar en este sistema.
                    </p>

                </div>

                <div className="carousel">

                    <img
                        key={current}
                        src={images[current]}
                        alt="control de gastos"
                        className="hero-image"
                    />

                </div>

            </section>

            <section className="section">
                <h2 className="section-title">
                    ¿Por qué utilizar nuestro sistema?
                </h2>

                <div className="cards">
                    <div className="card">
                        <h3>Control Total</h3>
                        <p>
                            Registra todos tus ingresos y gastos en un solo lugar
                            para mantener un control financiero completo.
                        </p>
                    </div>

                    <div className="card">
                        <h3>Reportes Inteligentes</h3>
                        <p>
                            Obtén gráficos y reportes automáticos que facilitan
                            el análisis de tus finanzas.
                        </p>
                    </div>

                    <div className="card">
                        <h3>Predicciones con IA</h3>
                        <p>
                            Recibe recomendaciones y proyecciones basadas en tus
                            hábitos de consumo.
                        </p>
                    </div>

                    <div className="card">
                        <h3>Seguridad</h3>
                        <p>
                            Toda tu información financiera se almacena de forma
                            segura y protegida.
                        </p>
                    </div>
                </div>
            </section>

            <section className="section process">
                <h2 className="section-title">
                    ¿Cómo funciona?
                </h2>

                <div className="steps">
                    <div className="step">
                        <span>1</span>
                        <h3>Crear Cuenta</h3>
                        <p>Regístrate en pocos segundos.</p>
                    </div>

                    <div className="step">
                        <span>2</span>
                        <h3>Registrar Movimientos</h3>
                        <p>Ingresa tus ingresos y gastos diarios.</p>
                    </div>

                    <div className="step">
                        <span>3</span>
                        <h3>Analizar Resultados</h3>
                        <p>Visualiza estadísticas y reportes.</p>
                    </div>

                    <div className="step">
                        <span>4</span>
                        <h3>Tomar Decisiones</h3>
                        <p>Optimiza tu presupuesto con ayuda de la IA.</p>
                    </div>
                </div>
            </section>

            <section className="stats">
                <div className="stat">
                    <h2>1000+</h2>
                    <p>Gastos Registrados</p>
                </div>

                <div className="stat">
                    <h2>500+</h2>
                    <p>Usuarios Activos</p>
                </div>

                <div className="stat">
                    <h2>95%</h2>
                    <p>Satisfacción</p>
                </div>

                <div className="stat">
                    <h2>24/7</h2>
                    <p>Disponibilidad</p>
                </div>
            </section>

            <section className="section ai-section">
                <div className="ai-content">
                    <h2>Potenciado con Inteligencia Artificial</h2>

                    <p>
                        Nuestro sistema analiza tus patrones de gasto para
                        ayudarte a identificar oportunidades de ahorro,
                        detectar excesos en determinadas categorías y generar
                        recomendaciones personalizadas para mejorar tu salud
                        financiera.
                    </p>
                </div>
            </section>

            <section className="cta">
                <h2>Empieza a controlar tus finanzas hoy mismo</h2>

                <p>
                    Organiza tus ingresos, controla tus gastos y toma mejores
                    decisiones financieras con ayuda de la inteligencia artificial.
                </p>

                <Link to="/register">
                    <button className="btn-register-header">
                        Crear Cuenta Gratis

                    </button>
                </Link>


            </section>
            <footer className="footer">
                © 2026 Sistema de Control de Gastos. Todos los derechos reservados.
            </footer>


        </div>
    );
}

export default Landing;