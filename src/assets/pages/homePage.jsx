import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import "../styles/Navbar.css";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero full-page">
        <h1 >Selamat Datang di <span className="brand">SpaceEase</span></h1>
        <p id="homeDes">Mengelola dan memantau tempat parkir kini lebih mudah.</p>
        <img src="\footage\footage1.jpeg" alt="Gambar Hero" className="section-image" />
        <button className="cta-button"><Link style={{textDecoration: 'none', color: "white"}} to="/monitoring">Mulai Sekarang</Link></button>
      </section>

      {/* About Section */}
      <section className="about full-page glassmorph">
        <h2 className="HomeTitle">Tentang SpaceEase</h2>
        <p id="homeDes">SpaceEase adalah sistem manajemen parkir berbasis AI yang membantu Anda menemukan dan memantau tempat parkir secara real-time.</p>
        <img src="\footage\footage2.jpeg" alt="Gambar Tentang" className="section-image" />
        <ul>
          <li id="homeDes">🔍 Deteksi tempat parkir secara real-time</li>
          <li id="homeDes">📊 Analisis data parkir yang akurat</li>
          <li id="homeDes">📱 Dapat diakses melalui aplikasi seluler</li>
        </ul>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works full-page glassmorph">
        <h2 className="HomeTitle">Cara Kerja</h2>
        <img src="\footage\footage3.jpeg" alt="Gambar Cara Kerja" className="section-image" />
        <div className="steps">
          <div id="homeDes" className="step">1️⃣ Pindai area parkir menggunakan kamera</div>
          <div id="homeDes" className="step">2️⃣ AI menganalisis dan mendeteksi tempat kosong</div>
          <div id="homeDes" className="step">3️⃣ Informasi tempat parkir ditampilkan di aplikasi</div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="cta-section full-page glassmorph">
        <h2 className="HomeTitle">Gunakan SpaceEase Sekarang!</h2>
        <p id="homeDes">Jadilah bagian dari revolusi parkir pintar bersama ribuan pengguna lainnya.</p>
        <img src="\footage\footage1.jpeg" alt="Gambar CTA" className="section-image" />
        <button className="cta-button">Daftar Sekarang</button>
      </section>
    </div>
  );
}

export default Home;
