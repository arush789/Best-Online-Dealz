import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import OfferItems from "../Components/OfferItems";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { CircularProgress, Typography, Pagination } from "@mui/material";
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

// import myImage from "/assets/images/home-img/home-img-3.png"
import myImage from "/assets/video/BODZ-Home.mp4"


import phoneImage from "/assets/video/BODZ-Home-phone.mp4"



const catagories = [
    "Smartphones",
    "Laptops",
    "In-Ear Headphones",
    "Ceiling Fans",
    "Smart Watches",
    "Perfume",
    "Kitchen appliances",
    "Mixer Grinders",
    "Smart TVs",
    "Speakers",
    "Power Banks",
    "Trimmers & Shavers"
]

const carouselPcImages = [myImage];
const carouselPhoneImages = [phoneImage];




export default function Home() {
    const [carouselImage, setCarouselImage] = useState([])
    const screen = useMediaQuery({ query: `(max-width:768px)` })

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
    };

    const handleClearFilter = () => {
        setSearchParams({});
        setCatagory('');
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    useEffect(() => {

        if (screen) {
            setCarouselImage(carouselPhoneImages);
        } else {
            setCarouselImage(carouselPcImages);
        }
        setLoading(true);
        const apiUrl = catagoryFilter
            ? `https://bodz-server.vercel.app/api/getItems?page=${currentPage}&category=${catagoryFilter}`
            : `https://bodz-server.vercel.app/api/getItems?page=${currentPage}`;

        axios.get(apiUrl)
            .then(res => {
                const receivedItems = res?.data?.items?.ItemsResult?.Items;
                setOffer(receivedItems);

                const receivedTotalPages = res?.data?.totalPages;
                setTotalPages(receivedTotalPages);
            })
            .catch(err => {
                console.error(err);
                setError("Error loading offers. Please refresh the page.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [currentPage, catagoryFilter, screen]);



    return (
        <div style={{ position: "relative", minHeight: "100vh" }}>
            <div>
                <Carousel interval={3000}>
                    {carouselImage && carouselImage.map((image, i) => (
                        <Carousel.Item key={i}>
                            <video
                                autoPlay
                                controls={false}  // Optional: Controls attribute set to false
                                muted
                                playsInline
                                src={image}
                                alt={`Slide ${i + 1}`}
                                className="home-images"
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
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
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '40px' }}>
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