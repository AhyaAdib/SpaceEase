import "../styles/home.css";

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1><span className="brand">Selamat Datang di <strong>SpaceEase</strong></span></h1>
        <p>Solusi parkir cerdas untuk pengalaman yang lebih mudah dan efisien.</p>
        <button className="cta-button">Pesan Parkir Sekarang</button>
      </section>

      {/* About Section */}
      <section className="about glassmorph">
        <div className="content">
          <h2>Tentang SpaceEase</h2>
          <p>SpaceEase adalah sistem parkir pintar berbasis AI yang membantu Anda menemukan tempat parkir dengan cepat dan nyaman.</p>
          <ul>
            <li>🚀 Parkir lebih cepat dan efisien.</li>
            <li>📡 Notifikasi real-time untuk ketersediaan slot.</li>
            <li>💳 Pembayaran digital yang mudah.</li>
          </ul>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>Cara Kerja</h2>
        <div className="steps">
          <div className="step glassmorph">1️⃣ Pilih lokasi parkir</div>
          <div className="step glassmorph">2️⃣ Pesan dan bayar secara digital</div>
          <div className="step glassmorph">3️⃣ Parkir dengan mudah menggunakan panduan sistem</div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section glassmorph">
        <h2>Siap Menggunakan SpaceEase?</h2>
        <button className="cta-button">Daftar Sekarang</button>
      </section>
    </div>
  );
}
