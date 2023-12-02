import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
    return (
        <header>
            <h1 className="brand-name">BODZ</h1>
            <ul>
                <li><NavLink>Home</NavLink></li>
                <li><NavLink>Best Deals</NavLink></li>
                <li><NavLink>Contact</NavLink></li>
            </ul>
        </header>
    )
}