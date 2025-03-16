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

            {/* <h1>{title}</h1> */}
            <h1>Tempat Parkir <br/> <b style={{    color: '#12dc65', fontSize: '2.2rem'}}>Heweh</b></h1>
            <br/>
            <div className="parkingMonitor">
                <div className="parkingSection">
                    {parkingData.map(({ blockName, blockUnit }) => (
                        <div key={blockName}>
                            {/* <div className="blockTitle">Block {blockName}</div> */}
                            <BlockUnit blockLength={blockUnit} blockName={blockName} />
                        </div>
                    ))}

                    
                </div>
                {/* <div className="bookContainer">
                    <Book />
                </div> */}
            </div>
        </>
    );
}
