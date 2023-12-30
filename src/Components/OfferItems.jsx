import React from 'react';
import { Link } from 'react-router-dom';

export default function OfferItems(props) {
  const offerItems = props.data.map((item) =>
    item.Offers.Listings.map((itemPrice) => (
      <Link key={item.ASIN} className='item-link' to={`offers/${item.ASIN}`}>
        <div className='item-container'>
          <div className='item-img-div'>
            <img src={item.Images.Primary.Large.URL} className='item-img' alt={item.ItemInfo.Title.DisplayValue} />
          </div>
          <h1 className='item-title'>
            {item.ItemInfo.Title.DisplayValue.split(',').slice(0, 1).join('\n')}
          </h1>
          <p className='item-price'>{itemPrice.Price.DisplayAmount}</p>
          {/* <p className='item-more'>More...</p> */}
          <Link to={`offers/${item.ASIN}`} className="buy-now-btn">Buy Now</Link>
        </div>
      </Link>
    ))
  );

  return <div className='item-page'>{offerItems}</div>;
}
