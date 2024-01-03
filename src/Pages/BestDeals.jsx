import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import OfferItems from "../Components/OfferItems";

export default function BestDeals() {
    const [offer, setOffer] = useState([]);

    useEffect(() => {
        axios.get('https://bodz-server.vercel.app/api/getItems')
            .then(res => {
                // setOffer(res?.data?.items?.ItemsResult?.Items);
                const filteredItems = res?.data?.items?.ItemsResult?.Items.filter(item => item?.Offers?.Listings[0]?.Price?.Savings?.Percentage > 30);
                setOffer(filteredItems);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    // setOffer(prevOffer => prevOffer.filter(() => prevOffer?.Offers?.Listing[0].Price?.Savings?.Percentage > 30))

    console.log(offer)
    return (
        <div style={{ position: "relative", minHeight: "100vh" }}>
            <h1 className="item-header">Best Deals</h1>
            <OfferItems data={offer} />
        </div>
    )
}