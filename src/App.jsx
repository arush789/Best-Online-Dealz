import React from "react";
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"
import Layout from "./Components/Layout";

const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Layout />} >
        <Route index element={<h1>Home</h1>} />
        <Route path="/best-deals" element={<h1>Best Deals</h1>} />
        <Route path="/contact" element={<h1>Contact</h1>} />
    </Route>
))

export default function App() {
    return (
        <RouterProvider router={router} />
    )
}