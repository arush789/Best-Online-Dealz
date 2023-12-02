import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
    return (
        <header>
            <h1 className="brand-name">BODZ</h1>
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/best-deals">Best Deals</NavLink></li>
                <li><NavLink to="/contact">Contact</NavLink></li>
            </ul>
        </header>
    )
}