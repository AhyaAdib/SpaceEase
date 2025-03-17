import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import { db, ref, onValue, set } from "../../../firebase.js";
import { Line } from "react-chartjs-2";
import "../styles/operator.css";
import "chart.js/auto";

export default function Operator() {
    const [totalIncome, setTotalIncome] = useState(0);
    const [portalOpen, setPortalOpen] = useState(false);

    useEffect(() => {
        const incomeRef = ref(db, "total_income");
        onValue(incomeRef, (snapshot) => {
            if (snapshot.exists()) {
                setTotalIncome(snapshot.val());
            }
        });
    }, []);

    const handleOpenPortal = () => {
        setPortalOpen(true);
        set(ref(db, "gateCommand"), "OPEN");

        setTimeout(() => {
            setPortalOpen(false);
            set(ref(db, "gateCommand"), 'CLOSED');
        }, 3000);
    };

    const chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
        datasets: [
            {
                label: "Kendaraan Masuk",
                data: [10, 23, 34, 45, 56, 67, 89, 90, 123, 233, 234, 456],
                borderColor: "#36D1DC",
                backgroundColor: "rgba(54, 209, 220, 0.5)",
                tension: 0.3,
            },
            {
                label: "Pendapatan",
                data: [20, 23, 54, 95, 96, 87, 89, 90, 123, 233, 123, 500],
                borderColor: "#FF512F",
                backgroundColor: "rgba(255, 81, 47, 0.5)",
                tension: 0.3,
            },
            {
                label: "Pengguna Aplikasi",
                data: [3, 12, 50, 80, 100, 178, 150, 250, 300, 338, 400, 432],
                borderColor: "#FFC837",
                backgroundColor: "rgba(255, 200, 55, 0.5)",
                tension: 0.3,
            }
        ],
    };
    

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <h1 className="dashboard-title">Dashboard Operator</h1>

                <div className="grid-container">
                    <div className="glass-card large green">
                        <h2>Total Pendapatan</h2>
                        <p>Rp {totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="glass-card medium blue">
                        <h2>Portal</h2>
                        <button onClick={handleOpenPortal} className={portalOpen ? "portal-button open" : "portal-button"}>
                            {portalOpen ? "Portal Terbuka" : "Buka Portal"}
                        </button>
                    </div>
                    <div className="glass-card small orange">
                        <h3>Slot Parkir Terpakai</h3>
                        <p>65% Terpakai</p>
                    </div>
                    <div className="glass-card small red">
                        <h3>Kendaraan Masuk Hari Ini</h3>
                        <p>120 Kendaraan</p>
                    </div>
                    <div className="glass-card small purple">
                        <h3>Jumlah Pelanggan Baru</h3>
                        <p>3 Pengguna</p>
                    </div>
                </div>

                <div className="chart-container">
                    <h2>Statistik</h2>
                    <Line data={chartData} />
                </div>

                <div className="parking-history">
                    <h2>Riwayat Parkir</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Nomor Polisi</th>
                                <th>Jenis Kendaraan</th>
                                <th>Waktu Masuk</th>
                                <th>Waktu Keluar</th>
                                <th>Pendapatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>AB 1234 CD</td><td>Mobil</td><td>10:15</td><td>11:45</td><td>Rp 5.000</td></tr>
                            <tr><td>B 5678 EF</td><td>Motor</td><td>11:00</td><td>13:30</td><td>Rp 10.000</td></tr>
                            <tr><td>D 9101 GH</td><td>Mobil</td><td>12:20</td><td>14:50</td><td>Rp 5.000</td></tr>
                            <tr><td>F 1122 IJ</td><td>Motor</td><td>14:00</td><td>16:30</td><td>Rp 10.000</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
