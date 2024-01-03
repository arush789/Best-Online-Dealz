import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import OfferItems from "../Components/OfferItems";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



const catagories = [
    "Electronics",
    "Fashion and Apparel",
    "Home and Furniture",
    "Beauty and Personal Care",
    "Health and Fitness",
    "Toys and Baby Products",
    "Books and Stationery",
    "Automotive",
    "Sports and Outdoors",
    "Jewelry and Watches",
    "Pet Supplies",
    "Art and Craft Supplies",
    "Electrical Appliances",
    "Gifts and Occasions",
    "Gardening and Outdoor Decor",
    "Food and Beverages",
    "Electrical and Lighting",
    "Business and Industrial Supplies",
    "Digital Products",
    "Bags & Luggage",
    "Subscription Boxes"
]


export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [offer, setOffer] = useState([])
    const [catagory, setCatagory] = React.useState('');

    const catagoryFilter = searchParams.get("catagory")

    const handleChange = (event) => {
        setCatagory(event.target.value);
        window.location.reload(false);
    };

    useEffect(() => {
        axios.get('https://bodz-server.vercel.app/api/getItems')
            .then(res => {
                if (catagoryFilter) {
                    const catagorisedItems = res?.data?.items?.ItemsResult?.Items.filter(item => item?.ItemInfo?.Classifications?.Binding?.DisplayValue === catagoryFilter);
                    setOffer(catagorisedItems);
                } else {
                    setOffer(res?.data?.items?.ItemsResult?.Items);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <div style={{ position: "relative", minHeight: "100vh" }}>
            <div className="home-page-offer">
                <h1>Offers</h1>
                <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                    <InputLabel id="demo-select-small-label">Catagories</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        autoWidth
                        value={catagoryFilter ? catagoryFilter : ""}
                        label="catagory"
                        onChange={handleChange}
                    >
                        {catagories.map((item, index) => (
                            <MenuItem onClick={() => setSearchParams({ catagory: item })} key={index} value={item} >{item}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <OfferItems data={offer} />
        </div>
    );
}
