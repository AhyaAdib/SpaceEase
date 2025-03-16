import { useState, useEffect, useRef  } from "react";
import Swal from "sweetalert2";
import SlotUnit from "./SlotUnit.jsx";
import React from "react";
import {db, ref, onValue} from "../../../firebase.js"
import { set, update } from "firebase/database";

function saveSlotStatusToDB(blockName, slotIndex, status)
{
  update(ref(db, `parkingSlots/${blockName}/${slotIndex}`), {status})
    .then(() => console.log("Data berhasil disimpan"))
    .catch((error) => console.error("Gagal menyimpan data:", error));
}

const savePlateNumberToDB = (blockName, slotIndex, plateNumber) => {
  update(ref(db, `parkingSlots/${blockName}/${slotIndex}/plateNumber`), plateNumber)
    .then(() => console.log("Data berhasil disimpan"))
    .catch((error) => console.error("Gagal menyimpan data:", error));
};



//duplikat
// function setSlotDipakai() {
//   const slotIndex = parseInt(inputSlot, 10) - 1;
//   if (isNaN(slotIndex) || slotIndex < 0 || slotIndex >= blockLength) {
//     alert("Nomor slot tidak valid");
//     return;
//   }

//   setSlotStatuses((prev) => {
//     const newStatuses = [...prev];
//     newStatuses[slotIndex] = "dipakai";
//     saveSlotStatusToDB(blockName, slotIndex, "dipakai");

//     const plateNumber = generatePlateNumber();
//     setPlateNumbers((prevPlates) => {
//       const newPlates = [...prevPlates];
//       newPlates[slotIndex] = plateNumber;
//       savePlateNumberToDB(blockName, slotIndex, plateNumber);
//       return newPlates;
//     });

//     return newStatuses;
//   });
// };



export default function BlockUnit({ blockName, blockLength }) {
  const statuses = ["kosong", "kosong", "dipesan"];
  
  const [slotStatuses, setSlotStatuses] = useState(
    Array.from({ length: blockLength }, () => "kosong")
  );

  const [plateNumbers, setPlateNumbers] = useState(Array(blockLength).fill(null));
  const [inputSlot, setInputSlot] = useState("");
  const [userSelectedSlot, setUserSelectedSlot] = useState(null); // Menyimpan slot yang dipilih user
  // const updateTimeoutRef = useRef(null);
  // const slotInfo = statusOptions[status] || statusOptions.kosong;

  const ShowWarn = (title, desc) => {
    Swal.fire({
        icon: "error",
        title: title,
        html: desc
    });
  }

  const handleToggle = (index) => {
    setSlotStatuses((prev) => {
        const newStatuses = [...prev];

        // Ambil status saat ini
        const currentStatus = newStatuses[index];

        // Definisikan slotInfo berdasarkan status
        const slotInfo = {
            icon: currentStatus === "kosong" ? "🟩" : currentStatus === "dipakai" ? "🚗" : "🛑",
            label: currentStatus === "kosong" ? "Available" : currentStatus === "dipakai" ? "Occupied" : "Reserved"
        };

        // Cek apakah slot sudah dipesan oleh user
        if (userSelectedSlot && userSelectedSlot !== `${blockName}-${index}`) {
            ShowWarn(
                `Parkir ${blockName}-${index+1} tidak dapat dipesan`,
                "Anda hanya bisa memesan 1 slot parkir! <br> Batalkan pesanan sebelumnya."
            );
            return prev; // Tidak mengubah status slot
        }

        if (currentStatus === "dipesan" && userSelectedSlot !== `${blockName}-${index}`) {
          ShowWarn(
              `Parkir ${blockName}-${index+1} telah dipesan pengguna lain`,
              "Anda dapat mencari tempat parkir lainnya"
          );
          return prev; // Tidak mengubah status slot
        }
        
        if (currentStatus === "dipakai" && userSelectedSlot !== `${blockName}-${index}`) {
          ShowWarn(
            `Parkir ${blockName}-${index+1} telah digunakan pengguna lain`,
            "Anda dapat mencari tempat parkir lainnya"
          );
          return prev; // Tidak mengubah status slot
        }
        
        if (currentStatus === "kosong") {
          newStatuses[index] = "dipesan";
          saveSlotStatusToDB(blockName, index, "dipesan");

          setTimeout(() => ResetUser(index), 19000);
          setUserSelectedSlot(`${blockName}-${index}`);
        } else if (currentStatus === "dipesan" && userSelectedSlot === `${blockName}-${index}`) {
            // setPlateNumbers((prevPlates) => {
            //     const newPlates = [...prevPlates];
            //     newPlates[index] = generatePlateNumber();
            //     return newPlates;
            // });

            // newStatuses[index] = "dipakai";
            // setUserSelectedSlot(null);

            //BUAT API
            newStatuses[index] = "kosong";
            saveSlotStatusToDB(blockName, index, "kosong");
            setUserSelectedSlot(null);
            
            setPlateNumbers((prevPlates) => {
              const newPlates = [...prevPlates];
              newPlates[index] = null;
              return newPlates;
            });
          }
          else if(currentStatus !== "dipesan" && currentStatus !== "dipakai"){
            newStatuses[index] = "kosong";
            saveSlotStatusToDB(blockName, index, "kosong");
            setUserSelectedSlot(null);
            setPlateNumbers((prevPlates) => {
                const newPlates = [...prevPlates];
                newPlates[index] = null;
                return newPlates;
            });
        }

        return newStatuses;
      });
  };


  const generatePlateNumber = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const codeArr = ['A', 'AB', 'B', 'AG', 'DK', 'L', 'S', 'M', 'N', 'T'];
    const codeName = codeArr[Math.floor(Math.random() * codeArr.length)];
    const numbersF = Math.floor(9 + Math.random() * 9); // 4 digit angka
    const suffix = letters.charAt(Math.floor(Math.random() * letters.length))
                  //  + letters.charAt(Math.floor(Math.random() * letters.length));
    return `${codeName} ${numbersF}** *${suffix}`;
  };

  useEffect(() => {
    const timeIntervals = [500, 1000, 2000, 5000, 10000, 15000, 20000];

    // const updateStatuses = () => {
    //     setSlotStatuses((prev) =>
    //         prev.map((status, idx) =>
    //           (userSelectedSlot && userSelectedSlot !== `${blockName}-${idx}`) || status !== "dipakai"
    //                 ? statuses[Math.floor(Math.random() * statuses.length)]
    //                 : status
    //         )
    //     );

    //   const nextInterval = timeIntervals[Math.floor(Math.random() * timeIntervals.length)];
    //   // console.log("Next update in:", nextInterval, "ms");

    //   setTimeout(updateStatuses, nextInterval);
    // };

    // const timeout = setTimeout(updateStatuses, 1000);
    
    const parkingRef = ref(db, `parkingSlots/${blockName}`)
    const unsubscribe = onValue(parkingRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSlotStatuses(Object.values(data).map((slot) => slot.status || "kosong"));
      } else {
        setTitle("Data tidak ditemukan");
      }
    });

    slotStatuses.forEach((_, idx) => {
      const plateRef = ref(db, `parkingSlots/${blockName}/${idx}/plateNumber`);
      
      onValue(plateRef, (snapshot) => {
        if (snapshot.exists()) {
          setPlateNumbers((prevPlates) => {
            const newPlates = [...prevPlates]
            newPlates[idx] = snapshot.val()
            return newPlates
          });
        }
      });
    })

    return () => unsubscribe();
    // return () => clearTimeout(timeout);
  }, [blockName]);

    
  const handleExpire = (index) => {
    setSlotStatuses(prevSlots => {
        const updatedSlots = [...prevSlots];
        console.log(updatedSlots[index]);
        updatedSlots[index] = "kosong";
        console.log(updatedSlots[index]);
        return updatedSlots;
    });
  };


  const setSlotDipakai = () => {
    const slotIndex = parseInt(inputSlot, 10) - 1;
    if (isNaN(slotIndex) || slotIndex < 0 || slotIndex >= blockLength) {
      alert("Nomor slot tidak valid");
      return;
    }

    setSlotStatuses((prev) => {
      const newStatuses = [...prev];
      newStatuses[slotIndex] = "dipakai";
      return newStatuses;
    });

    setPlateNumbers((prevPlates) => {
      const newPlates = [...prevPlates];
      newPlates[slotIndex] = generatePlateNumber();
      savePlateNumberToDB(blockName, slotIndex, newPlates[slotIndex]);
      return newPlates;
    });

    saveSlotStatusToDB(blockName, slotIndex, "dipakai");

    setInputSlot("");
  };

  const ResetUser = (index) => {
    setUserSelectedSlot(null);
    saveSlotStatusToDB(blockName, index, "kosong"); // Gunakan index yang dikirim dari setTimeout
  };

  return (
    <div className="blockContainer">
      <h2 className="blockTitle">Blok {blockName}</h2>

      {/* <div style={{ marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="Nomor slot"
          value={inputSlot}
          onChange={(e) => setInputSlot(e.target.value.replace(/\D/, ""))}
          style={{ padding: "5px", marginRight: "5px" }}
        />
        <button onClick={setSlotDipakai}>Set Dipakai</button>
      </div> */}

      <div className="slotContainer">
        {slotStatuses.map((status, index) => (
          <SlotUnit 
            key={index} 
            blockName={blockName} 
            index={index} 
            status={status} 
            plateNumber={plateNumbers[index]} // Kirim plat nomor ke SlotUnit
            onToggle={() => handleToggle(index)} 
            onExpire={handleExpire}
            userSelectedSlot={userSelectedSlot}
          />
        ))}
      </div>
    </div>
  );
}
