import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function OtherOfferItems(props) {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const { data } = props;
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const offerItems = currentItems.map((item) => (
        <Link key={item?.id} className='item-link' to={`/other-offers/${item?.id}`} onClick={scrollToTop}>
            <div className='item-container'>
                <div className='item-img-div'>
                    <img src={item?.imageurl} className='item-img' alt={item?.title} />
                </div>
                <h1 className='item-title'>{item?.title}</h1>
                <p key={item?.ASIN} className='item-price'>
                    ₹{item?.price}
                </p>
                <button className="buy-now-btn" onClick={scrollToTop}>
                    Buy Now
                </button>
            </div>
        </Link>
    ));

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            <div className='item-page'>{offerItems}</div>
            <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" marginTop="20px" marginBottom="40px">
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Stack>
        </>
    );
}
