import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import clickSound from "../sfx/click.wav";
import {db, ref, get, set, update} from "../../../firebase.js"


const parkingRate = 10
const startParkingRate = 3000


function SlotUnit({ blockName, index, status, plateNumber, onToggle, onExpire, userSelectedSlot}) {
    const [reservedTime, setReservedTime] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const isUserSelected = userSelectedSlot === `${blockName}-${index}` 

    const durationRef = ref(db, `parkingSlots/${blockName}/${index}/startTime`)
    const countdownRef = ref(db, `parkingSlots/${blockName}/${index}/countdown`)
    const statusOptions = {
        kosong: {
            label: "Tersedia",
            icon: "🟩",
            color: "#28a745",
            description: "Slot ini tersedia untuk parkir. Anda dapat menggunakannya kapan saja."
        },
        dipakai: {
            label: "Dipakai",
            icon: "🚗",
            color: "#dc3545",
            description: "Slot ini sedang digunakan oleh kendaraan lain."
        },
        dipesan: {
            label: "Dipesan",
            icon: "🛑",
            color: "#ffc107",
            description: "Slot ini telah dipesan. Hanya pemilik yang dapat menggunakannya."
        }
    };

    const slotStyle = {
        backgroundColor: isUserSelected ? "#578FCA" : statusOptions[status]?.color || "#ccc"
    };
    

    const playSound = () => {
        const audio = new Audio(clickSound);
        audio.play();
    };

    useEffect(() => {
        if (status === "dipesan") {
            setReservedTime(new Date());

            const timeout = setTimeout(() => {
                onExpire(index); // Panggil fungsi untuk mengubah status menjadi "kosong"
            }, 20000); // 20 detik

            return () => clearTimeout(timeout); // Bersihkan timeout jika status berubah sebelum waktunya
        } else if (status === "dipakai") {
            setStartTime(new Date());
            setReservedTime(null);
        } else {
            setStartTime(null);
            setReservedTime(null);
        }
    }, [status]);

    const getCountdown = () => {
        if (!reservedTime) return "00:00";

        const elapsed = Math.floor((new Date() - reservedTime) / 1000);
        const remaining = Math.max(20 - elapsed, 0);

        if(remaining < 0)
        {
            setStartTime(null);
            setReservedTime(null);
            // status = "kosong";
            onExpire(index)
        }

        return `${Math.floor(remaining / 60)} menit ${(remaining % 60).toString().padStart(2, "0")} detik`;
    };

    const getParkingDuration = async () => {
        if (!startTime) return "0 detik";
        
        let elapsed

        try {
            const snapshot = await get(durationRef)
            if(snapshot.exists())
            {
                const savedStartTime = new Date(snapshot.val())
                elapsed = Math.floor((new Date() - savedStartTime / 1000))
            } else {
                await set(durationRef, startTime.getTime())
                elapsed = 0
            }

            // await update(durationRef, startTime.getTime())
        } catch (e) {
            console.log('Error fetching parking duration:', e)
            elapsed = 0
        }


        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        return `${hours.toString().padStart(2, "0")} jam ${minutes.toString().padStart(2, "0")} menit ${seconds.toString().padStart(2, "0")} detik`;
    };

    const getTotalCost = () => {
        if (!startTime) return "Rp 0";

        const elapsed = Math.floor((new Date() - startTime) / 1000);
        return `Rp ${startParkingRate + elapsed * parkingRate}`;
    };

     // Fungsi checkout: menampilkan opsi pembayaran dan konfirmasi
    const checkout = async () => {
        Swal.fire({
        title: "Konfirmasi Keluar Parkir",
        text: "Pilih metode pembayaran:",
        icon: "question",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Bayar Cash",
        denyButtonText: "Bayar E‑Wallet",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#4FD1A7",
        denyButtonColor: "#FFA500",
        cancelButtonColor: "#FF6565"
        }).then(async (result) => {
        if (result.isConfirmed) {
            // Bayar cash: langsung proses checkout
            try {
            const totalCost = getTotalCost();
            await update(ref(db, `parkingSlots/${blockName}/${index}`), {
                status: "kosong",
                startTime: "0",
                totalCost: totalCost
            });
            await set(ref(db, "/gateCommand"), "OPEN");
            Swal.fire("Sukses", "Portal terbuka, silakan keluar!", "success");
            } catch (error) {
            console.error("Checkout error:", error);
            Swal.fire("Error", "Terjadi kesalahan saat checkout", "error");
            }
        } else if (result.isDenied) {
            // Bayar E‑Wallet: tampilkan opsi e-wallet dengan grid dan gambar
            Swal.fire({
              title: "Pembayaran E‑Wallet",
              html: `
                <div class="ewallet-grid">
                  <button class="ewallet-option" data-value="BCA">
                    <img src="https://pbs.twimg.com/media/Dt3a9mIXcAASN-Y.jpg" alt="BCA" />
                    <span>BOCA</span>
                  </button>
                  <button class="ewallet-option" data-value="BRI">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvggF7NSCS0Be-uwwe09frkmXzg7m7tyHzQvE19513K3YWV9A5FYYg6ywxobD9DuEwNu0&usqp=CAU" 
                    alt="BRO" />
                    <span>BRI</span>
                  </button>
                  <button class="ewallet-option" data-value="Gopay">
                    <img src="https://scontent-cgk1-1.xx.fbcdn.net/v/t1.6435-9/116576117_1240381752980213_1231666167387861196_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=2ksVZmk0BrcQ7kNvgHyXfeZ&_nc_oc=AdiEoqm7tu7NlysB_ukiVnqoZnJy5ir_LDmR3CPAp-upukGIMfPHyFpEehq4gPQgkDY&_nc_zt=23&_nc_ht=scontent-cgk1-1.xx&_nc_gid=AveuQIFhR_6NStdriF7D2a2&oh=00_AYCsYpbc3AAhLM8BrqrZs0luirqNwylC1GyBbbC3GCRJ9Q&oe=67EC193C" 
                    alt="Gopay" />
                    <span>Bokek</span>
                  </button>
                </div>
              `,
              showCancelButton: true,
              confirmButtonText: "Pilih",
              cancelButtonText: "Cancel",
              confirmButtonColor: "#4FD1A7",
              cancelButtonColor: "#FF6565",
              didOpen: () => {
                const buttons = Swal.getPopup().querySelectorAll(".ewallet-option");
                buttons.forEach((btn) => {
                  btn.addEventListener("click", () => {
                    // Hapus highlight dari tombol lain
                    buttons.forEach((b) => b.classList.remove("selected"));
                    // Tandai tombol yang dipilih
                    btn.classList.add("selected");
                  });
                });
              }
            }).then(async (resultEWallet) => {
              if (resultEWallet.isConfirmed) {
                const selectedBtn = Swal.getPopup().querySelector(".ewallet-option.selected");
                if (selectedBtn) {
                  const method = selectedBtn.getAttribute("data-value");
                  try {
                    const totalCost = getTotalCost();
                    await update(ref(db, `parkingSlots/${blockName}/${index}`), {
                      status: "kosong",
                      startTime: "0",
                      totalCost: totalCost
                    });
                    await set(ref(db, "/gateCommand"), "OPEN");
                    Swal.fire("Sukses", `Pembayaran dengan ${method} berhasil! Portal terbuka, silakan keluar!`, "success");
                  } catch (error) {
                    console.error("Checkout error:", error);
                    Swal.fire("Error", "Terjadi kesalahan saat checkout", "error");
                  }
                }
              } else if (resultEWallet.isDismissed) {
                Swal.fire("Cancelled", "Pembayaran dibatalkan", "info");
              }
            });
          }
          
        });
    };


    const handleInfoClick = async () => {
        playSound(); // Memastikan suara diputar sebelum membuka modal
        let countdown = "00:00"
        let duration = "0 detik"
        let totalCost = "Rp 0"


        try {
            const countdownSnap = await get(countdownRef)
            if(countdownSnap.exists())
            {
                const elapsed= countdownSnap.val()
                const remaining = Math.max(20 - elapsed, 0)
                countdown = `${Math.floor(remaining / 60)} menit ${(remaining % 60).toString().padStart(2, "0")} detik`;
            }

            const durationSnap = await get(durationRef)
            if(durationSnap.exists())
            {
                const savedStartTime = new Date(durationSnap.val());
                const elapsed = Math.floor((new Date() - savedStartTime) / 1000);
                const hours = Math.floor(elapsed / 3600);
                const minutes = Math.floor((elapsed % 3600) / 60);
                const seconds = elapsed % 60;
                duration = `${hours.toString().padStart(2, "0")} jam ${minutes.toString().padStart(2, "0")} menit ${seconds.toString().padStart(2, "0")} detik`;
                totalCost = `Rp ${startParkingRate + elapsed * parkingRate}`;
            }
        } catch (e) {
            console.error("Error fetching slot data:", e);
        }

        const slotInfo = statusOptions[status];

        let content = `<p>${slotInfo.description}</p>`;

        if (status === "dipesan") {
        content += `<p><strong>Waktu Pemesanan:</strong> ${reservedTime ? reservedTime.toLocaleTimeString() : "-"}</p>`;
        const expiredTime = new Date(reservedTime.getTime() + 20000); // Tambah 20 detik
        content += `<p><strong>Waktu Hangus:</strong> ${expiredTime.toLocaleTimeString()}</p>`;
        content += `<p><strong>Waktu Tersisa:</strong> <span id="countdown">${getCountdown()}</span></p>`;
        } else if (status === "dipakai" && plateNumber) {
        content += `<p><strong>Plat Nomor:</strong> ${plateNumber}</p>`;
        content += `<p><strong>Mulai Parkir:</strong> ${startTime ? startTime.toLocaleTimeString() : "-"}</p>`;
        content += `<p><strong>Durasi Parkir:</strong> <span id="parkingDuration">${await getParkingDuration()}</span></p>`;
        content += `<p><strong>Total Biaya:</strong> <span id="totalCost">${getTotalCost()}</span></p>`;
        content += `<button id="checkoutBtn" style="
            background: #4FD1A7; 
            color: #fff; 
            padding: 15px 34px; 
            border: none; 
            border-radius: 4px; 
            font-weight: bold; 
            cursor: pointer;
            margin-top: 10px;
            ">
            Keluar Parkir
            </button>`;
        }

        Swal.fire({
            title: `${slotInfo.icon} ${slotInfo.label}`,
            html: content,
            icon: "info",
            confirmButtonText: "OK",
            didOpen: async () => {
                let interval;
                if (status === "dipakai") {
                interval = setInterval(async () => {
                    document.getElementById("parkingDuration").innerText = await getParkingDuration();
                    document.getElementById("totalCost").innerText = getTotalCost();
                }, 1000);
                } else if (status === "dipesan") {
                interval = setInterval(async () => {
                    document.getElementById("countdown").innerText = await getCountdown();
                }, 1000);
                }
                
                const checkoutBtn = document.getElementById("checkoutBtn");
                if (checkoutBtn) {
                checkoutBtn.addEventListener("click", checkout);
                }
                
                Swal.getPopup().addEventListener("click", () => {
                clearInterval(interval);
                });
            }
        });
    };

    return (
        <>
            <div className="slotWrapper">
                <button 
                    className="slotUnit" 
                    onClick={() => { playSound(); onToggle(); }} 
                    style={slotStyle}
                >
                    {/* {console.log(statusOptions[status])} */}
                    {/* {console.log(blockName + index)}
                    {console.log(status)}
                    {console.log(statusOptions[status].icon)} */}
                    <div className="slotIcon">{statusOptions[status].icon  || "❓"}</div>
                    <div className="slotText">
                        {blockName} {index + 1}
                        <span className="statusLabel">{statusOptions[status].label}</span>
                        {status === "dipakai" && plateNumber && (
                            <span style={{ fontSize: "12px", color: "#fff", marginTop: "5px" }}>
                                <strong>{plateNumber}</strong>
                            </span>
                        )}
                        {isUserSelected && <span style={{ color: "blue", fontWeight: "bold" }}> (Pesananmu)</span>}
                    </div>
                </button>

                <button className="infoButton" onClick={handleInfoClick}>ℹ️</button>
            </div>
        </>
    );
}

export default SlotUnit;
