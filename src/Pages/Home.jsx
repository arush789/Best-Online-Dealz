import React, { Suspense, useEffect, useState } from "react";
import myImage from "/assets/images/home-img/home-img-3.png";
import axios from "axios";
import { Await } from "react-router";
import OfferItems from "../Components/OfferItems";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// ... (imports)

export default function Home() {
    const [offer, setOffer] = useState([]);

    useEffect(() => {
        axios.get('https://bodz-server.vercel.app/api/getItems')
            .then(res => {
                setOffer(res?.data?.items?.ItemsResult?.Items);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <div style={{ position: "relative", minHeight: "100vh" }}>
            {/* <img src={myImage} className="home-img" /> */}
            <h1 className="item-header">Offers</h1>
            <OfferItems data={offer} />
        </div>
    );
}
