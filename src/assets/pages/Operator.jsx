import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { Line } from "react-chartjs-2";
import Swal from "sweetalert2";
import "../styles/operator.css";
import "chart.js/auto";

export default function Operator() {
    const db = getDatabase();
    
    const [totalIncome, setTotalIncome] = useState(0);
    // const [portalOpen, setPortalOpen] = useState(false);
    const [portalOpenLeft, setPortalOpenLeft] = useState(false);
    const [portalOpenRight, setPortalOpenRight] = useState(false);


    const blocks = ["A", "B", "C"]; // Pastikan daftar blok dideklarasikan


    useEffect(() => {
        const incomeRef = ref(db, "total_income");
        onValue(incomeRef, (snapshot) => {
            if (snapshot.exists()) {
                setTotalIncome(snapshot.val());
            }
        });
    }, [db]); // Menambahkan `db` sebagai dependensi

    const handleOpenPortal = (isLeft) => {
        console.log(`Membuka portal ${isLeft ? "kiri" : "kanan"}...`);
    
        const gateCommand = isLeft ? "gateCommandL" : "gateCommand";
        const setPortalState = isLeft ? setPortalOpenLeft : setPortalOpenRight;
    
        setPortalState(true);
        set(ref(db, gateCommand), "OPEN")
            .then(() => console.log(`Portal ${isLeft ? "kiri" : "kanan"} terbuka`))
            .catch((error) => console.error("Error membuka portal:", error));
    
        setTimeout(() => {
            console.log(`Menutup portal ${isLeft ? "kiri" : "kanan"}...`);
            setPortalState(false);
            set(ref(db, gateCommand), "CLOSED")
                .then(() => console.log(`Portal ${isLeft ? "kiri" : "kanan"} tertutup`))
                .catch((error) => console.error("Error menutup portal:", error));
        }, 3000);
    };
    
    

    const handleManualEntry = async () => {
        const { value: formValues } = await Swal.fire({
            title: "Input Pengguna Masuk",
            html: `
                <label for="swal-block">Blok:</label>
                <select id="swal-block" class="swal2-input">
                    <option value="">Pilih Blok</option>
                    ${blocks.map(block => `<option value="${block}">${block}</option>`).join("")}
                </select>
    
                <label for="swal-slot">Slot:</label>
                <select id="swal-slot" class="swal2-input" disabled>
                    <option value="">Pilih Slot</option>
                </select>
    
                <label for="swal-plate">Plat Nomor:</label>
                <input id="swal-plate" class="swal2-input" placeholder="Masukkan Plat Nomor" />
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Simpan",
            didOpen: () => {
                const blockSelect = document.getElementById("swal-block");
                const slotSelect = document.getElementById("swal-slot");
    
                blockSelect.addEventListener("change", (e) => {
                    const selectedBlock = e.target.value;
                    if (!selectedBlock) {
                        slotSelect.innerHTML = `<option value="">Pilih Slot</option>`;
                        slotSelect.disabled = true;
                        return;
                    }
    
                    const slotsRef = ref(db, `parkingSlots/${selectedBlock}`);
                    onValue(slotsRef, (snapshot) => {
                        if (snapshot.exists()) {
                            const slotData = snapshot.val();
                            const availableSlots = Object.keys(slotData).filter(
                                (slot) => slotData[slot].status === "kosong"
                            );
    
                            if (availableSlots.length > 0) {
                                slotSelect.innerHTML = availableSlots
                                    .map((slot) => `<option value="${slot}">${slot}</option>`)
                                    .join("");
                                slotSelect.disabled = false;
                            } else {
                                slotSelect.innerHTML = `<option value="">Tidak Ada Slot Kosong</option>`;
                                slotSelect.disabled = true;
                            }
                        }
                    });
                });
            },
            preConfirm: () => {
                return {
                    block: document.getElementById("swal-block").value,
                    slot: document.getElementById("swal-slot").value,
                    plate: document.getElementById("swal-plate").value
                };
            }
        });
    
        if (!formValues || !formValues.block || !formValues.slot || !formValues.plate) {
            Swal.fire("Error", "Semua kolom harus diisi!", "error");
            return;
        }
    
        const parkingRef = ref(db, `parkingSlots/${formValues.block}/${formValues.slot}`);
        set(parkingRef, {
            status: "dipakai",
            plateNumber: formValues.plate,
        }).then(() => {
            Swal.fire(
                "Berhasil",
                `Slot ${formValues.block}-${formValues.slot} telah dipakai oleh ${formValues.plate}`,
                "success"
            );
    
            // Buka portal setelah penyimpanan berhasil
            handleOpenPortal(true);
        }).catch((error) => {
            Swal.fire("Error", error.message, "error");
        });
    };

    const handleCheckout = async () => {

        const { value: formValues } = await Swal.fire({
            title: "Checkout Kendaraan",
            html: `
                <label for="swal-block">Blok:</label>
                <select id="swal-block" class="swal2-input">
                    <option value="">Pilih Blok</option>
                    ${blocks.map(block => `<option value="${block}">${block}</option>`).join("")}
                </select>
    
                <label for="swal-slot">Slot:</label>
                <input id="swal-slot" class="swal2-input" placeholder="Masukkan Slot" />
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Checkout",
            preConfirm: () => {
                return {
                    block: document.getElementById("swal-block").value,
                    slot: document.getElementById("swal-slot").value
                };
            }
        });
    
        // Validasi input
        if (!formValues || !formValues.block || !formValues.slot) {
            Swal.fire("Error", "Semua kolom harus diisi!", "error");
            return;
        }
    
        // Proses checkout
        const parkingRef = ref(db, `parkingSlots/${formValues.block}/${formValues.slot}`);
        set(parkingRef, {
            status: "kosong",
            plateNumber: ""
        }).then(() => {
            handleOpenPortal(false);
            Swal.fire(
                "Berhasil",
                `Slot ${formValues.block}-${formValues.slot} telah kosong.`,
                "success"
            );
        }).catch((error) => {
            Swal.fire("Error", error.message, "error");
        });
    };
    
    
    const chartData = {
        labels: ["Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des", "Jan", "Feb", "Mar"],
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
                        <button style={{margin: '2px'}} onClick={() => handleOpenPortal(false)} 
                                className={portalOpenRight ? "portal-button open" : "portal-button"}>
                            {portalOpenRight ? "Portal Terbuka" : "Portal Kanan"}
                        </button>

                        <button style={{margin: '2px'}} onClick={() => handleOpenPortal(true)} 
                                className={portalOpenLeft ? "portal-button open" : "portal-button"}>
                            {portalOpenLeft ? "Portal Terbuka" : "Portal Kiri"}
                        </button>

                    </div>
                    <div className="glass-card medium red">
                        <h3>Kendaraan Masuk Hari Ini</h3>
                        <p>120 Kendaraan</p>
                    </div>
                    <div className="glass-card large orange">
                        <h2>Input Manual Pengguna Masuk</h2>
                        <button onClick={handleManualEntry} className="portal-button">
                            Input Pengguna Masuk
                        </button>
                    </div>
                    <div className="glass-card large green">
                        <h2>Checkout Manual Pengguna Keluar</h2>
                        <button onClick={handleCheckout} className="portal-button">
                            Checkout Pengguna
                        </button>
                    </div>
                    <div className="glass-card medium purple">
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
