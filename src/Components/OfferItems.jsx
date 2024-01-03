import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Stack } from '@mui/material';

export default function OfferItems(props) {
  const itemsPerPage = 5;
  const totalItems = props.data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    scrollToTop();
  };

  const slicedData = props.data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const offerItems = slicedData.map((item) => (
    <Link key={item?.ASIN} className='item-link' to={`/offers/${item?.ASIN}`} onClick={scrollToTop}>
      <div className='item-container'>
        <div className='item-img-div'>
          <img src={item?.Images?.Primary?.Large.URL} className='item-img' alt={item?.ItemInfo?.Title?.DisplayValue} />
        </div>
        <h1 className='item-title'>
          {item?.ItemInfo?.Title?.DisplayValue.split(/[,\s\n-]+/).slice(0, 7).join('\n')}
        </h1>
        {item?.Offers?.Listings?.map((itemPrice) => (
          <p key={item?.ASIN} className='item-price'>{itemPrice?.Price?.DisplayAmount}</p>
        ))}
        <button className="buy-now-btn" onClick={scrollToTop}>
          Buy Now
        </button>
      </div>
    </Link>
  ));

  return (
    <>
      <div className='item-page'>{offerItems}</div>
      {
        props.pagination ?
        <div className='pagination'>
          <Stack spacing={2} justifyContent="center" style={{ margin: 'auto' }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              shape="rounded"
              color="primary"
            />
          </Stack>
        </div>
        :
        <></>
      }
    </>
  );
}
