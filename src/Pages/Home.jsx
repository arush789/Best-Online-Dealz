import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import OfferItems from "../Components/OfferItems";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { CircularProgress, Typography, Pagination } from "@mui/material";




const catagories = [
    "Electronics",
    // "Fashion and Apparel",
    // "Home and Furniture",
    "Health and Beauty",
    // "Health and Fitness",
    // "Toys and Baby Products",
    // "Books and Stationery",
    // "Automotive",
    // "Sports and Outdoors",
    // "Jewelry and Watches",
    // "Pet Supplies",
    // "Art and Craft Supplies",
    // "Electrical Appliances",
    // "Gifts and Occasions",
    // "Gardening and Outdoor Decor",
    // "Food and Beverages",
    // "Electrical and Lighting",
    // "Business and Industrial Supplies",
    // "Digital Products",
    // "Bags & Luggage",
    // "Subscription Boxes"
]



export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [offer, setOffer] = useState([]);
    const [catagory, setCatagory] = React.useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const catagoryFilter = searchParams.get("catagory");

    const handleChange = (event) => {
        setCatagory(event.target.value);
        window.location.reload(false);
    };

    const handleClearFilter = () => {
        setSearchParams({});
        setCatagory('');
        window.location.reload(false);
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        setLoading(true);
        axios.get(`https://bodz-server.vercel.app/api/getItems?page=${currentPage}`)
            .then(res => {
                if (catagoryFilter) {
                    const catagorisedItems = res?.data?.items?.ItemsResult?.Items.filter(item => item?.ItemInfo?.Classifications?.Binding?.DisplayValue === catagoryFilter);
                    setOffer(catagorisedItems);

                } else {
                    setOffer(res?.data?.items?.ItemsResult?.Items);
                }

                const receivedTotalPages = res?.data?.totalPages;
                setTotalPages(receivedTotalPages)

            })
            .catch(err => {
                console.error(err);
                setError("Error loading offers. Please refresh the page.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [currentPage, catagoryFilter]);



    return (
        <div style={{ position: "relative", minHeight: "100vh" }}>
            <div className="home-page-offer">
                <h1>Offers</h1>
                <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                    <InputLabel id="demo-select-small-label">Categories</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        autoWidth
                        value={catagoryFilter ? catagoryFilter : ""}
                        label="category"
                        onChange={handleChange}
                    >
                        {catagories.map((item, index) => (
                            <MenuItem onClick={() => setSearchParams({ catagory: item })} key={index} value={item}>{item}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {catagoryFilter && (
                    <Button variant="contained" color="secondary" onClick={handleClearFilter} style={{ margin: '10px' }}>
                        Clear Filter
                    </Button>
                )}
            </div>
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {error ? (
                        <Typography variant="body1" color="error" style={{ textAlign: 'center', margin: '20px' }}>
                            {error}
                        </Typography>
                    ) : (
                        <>
                            <OfferItems data={offer} />
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </div>
                        </>
                    )}
                </>

            )}
        </div>
    );
}