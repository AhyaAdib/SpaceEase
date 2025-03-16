import { useEffect, useState } from "react";
import BlockUnit from "../components/BlockUnit.jsx";
import "../styles/homePage.css";
import Navbar from "../components/Navbar.jsx";
import {db, ref, onValue} from "../../../firebase.js"

function Book()
{
  return (
    <>
      <h1>Pesan Sekarang</h1>
    </>
  )
}

export default function HomePage() {
    const [title, setTitle] = useState("Halo")
    const parkingData = [
        { blockName: "A", blockUnit: 3 },
        { blockName: "B", blockUnit: 4 },
        { blockName: "C", blockUnit: 4 },
    ];

    // const [userSlot, setUserSlot] = useState(null);
    const [userSelectedSlot, setUserSelectedSlot] = useState(null); // Menyimpan slot yang dipilih user

    // useEffect(() => {
    //     const data = ref(db);

    //     onValue(data, (snapshot) => {
    //         setTitle(snapshot.val().title)
    //     })
    // }, [db])
    return (
        <>
            <Navbar />

            <h1>Ini Home</h1>
        </>
    );
}
