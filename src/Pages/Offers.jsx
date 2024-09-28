import React, { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive';
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import OfferItems from "../Components/OfferItems";

import { CircularProgress, Pagination, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import CloseIcon from '@mui/icons-material/Close';
import SortIcon from '@mui/icons-material/Sort';

const categories = [
    "Smartphones",
    "Laptops",
    "In-Ear Headphones",
    "Ceiling Fans",
    "Smart Watches"
];

const Offers = () => {

    const isMobile = useMediaQuery({ query: `(max-width:1500px)` });
    const [searchParams, setSearchParams] = useSearchParams();
    const [offer, setOffer] = useState([]);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    const [filterOpen, setFilterOpen] = useState(!isMobile);

    const categoryFilter = searchParams.get("category");

    const handleClearFilter = () => {
        setSearchParams({});
        setCategory('');
        if (isMobile) setFilterOpen(false);
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const toggleFilter = () => {
        if (isMobile) {
            setFilterOpen(prev => !prev);
        }
    };

    useEffect(() => {
        setLoading(true);
        const apiUrl = categoryFilter
            ? `https://bodz-server.vercel.app/api/getItems?page=${currentPage}&category=${categoryFilter}`
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
    }, [currentPage, categoryFilter]);

    useEffect(() => {
        if (isMobile) {
            setFilterOpen(false);
        } else {
            setFilterOpen(true);
        }
    }, [isMobile]);

    return (
        <div className="offers-page">

            {isMobile && (
                <div className="filter-btn-div">
                    <button onClick={toggleFilter} className="filter-btn">
                        {filterOpen
                            ? <div><CloseIcon /></div>
                            : <div><SortIcon /> Filter</div>
                        }
                    </button>
                </div>
            )}


            {filterOpen && (
                <div className="filter-section">
                    <h1 className="filter-title">Filter</h1>
                    <div className="filter-list">
                        {categories.map((item, index) => (
                            <p
                                key={index}
                                className={`filter-item ${categoryFilter === item ? 'active-filter' : ''}`}
                                onClick={() => {
                                    setSearchParams({ category: item });
                                    if (isMobile) setFilterOpen(false);
                                }}
                            >
                                {item}
                            </p>
                        ))}
                    </div>
                    {categoryFilter && (
                        <Button variant="contained" color="secondary" onClick={handleClearFilter} style={{ margin: '10px' }}>
                            Clear Filter
                        </Button>
                    )}
                </div>
            )}

            <div className="offers-list">
                {loading ? (
                    <div className="loading-container">
                        <CircularProgress />
                    </div>
                ) : error ? (
                    <Typography variant="body1" color="error" className="error-message">
                        {error}
                    </Typography>
                ) : (
                    <>
                        <OfferItems data={offer} />
                        <div className="pagination-container">
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Offers;
