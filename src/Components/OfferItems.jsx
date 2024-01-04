import React from 'react';
import { Link } from 'react-router-dom';

export default function OfferItems(props) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const offerItems = props.data.map((item) => (
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
    </>
  );
}
