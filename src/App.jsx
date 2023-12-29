import React from "react";
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import Layout from "./Components/Layout";

import Home, {loader as HomeDataLoader} from "./Pages/Home";
import BestDeals from "./Pages/BestDeals";
import Contact from "./Pages/Contact";
import Disclaimer from "./Pages/Disclaimer";
import About from "./Pages/About";

import OfferDetail, {loader as OfferDetailLoader} from "./Pages/OfferDetail.jsx";


// import "./Server/dummyServer.js"

const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Layout />} >

        <Route index element={<Home />} loader={HomeDataLoader}/>
        <Route path="/offers/:id" element={<OfferDetail />} loader={OfferDetailLoader} />
        
        <Route path="/best-deals" element={<BestDeals />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/about" element={<About />} />
    </Route>
))

export default function App() {
    return (
        <RouterProvider router={router} />
    )
}