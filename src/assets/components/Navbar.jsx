import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/Navbar.css";
import profilePic from "../img/profile.png"; // Ganti dengan path gambar profil

function Navbar() {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <>
        <nav className="navbar">
        <div className="navbar-container">
            {/* Logo */}
            <Link to="/" className="navbar-logo" >
                Space
                <span style={{ color: 'lightgreen',  WebkitTextStrokeWidth: '.5px', WebkitTextStrokeColor: 'rgb(0 227 0)' }}>
                Ease
                </span> 
            </Link>

            <div className="menu">

                {/* Menu Toggle (Mobile) */}
                <div className="menu-icon" onClick={toggleMenu}>
                {menuActive ? <FaTimes /> : <FaBars />}
                </div>

                {/* Menu List */}
                <ul className={`navbar-menu ${menuActive ? "active" : ""}`}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/monitoring">Monitoring</Link></li>
                <li><Link to="/profile">Profil</Link></li>
                </ul>

                {/* Foto Profil */}
                <div className="profile-container">
                <img src={profilePic} alt="Profile" className="profile-pic" />
                </div>
            </div>
        </div>
        </nav>
        <br/>
        <br/>
    </>
  );
}

export default Navbar;
