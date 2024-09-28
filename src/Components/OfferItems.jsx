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

        {item?.Offers?.Listings?.map((itemPrice, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'red',
              color: 'white',
              padding: '10px',
              position: 'absolute',
              top: 20,
              right: 20,
              borderRadius: 50,
            }}
          >
            <span>- {itemPrice?.Price?.Savings?.Percentage}%</span>
          </div>
        ))}

        <div className='item-img-div'>
          <img
            src={item?.Images?.Primary?.Large.URL}
            className='item-img'
            alt={item?.ItemInfo?.Title?.DisplayValue}
          />
        </div>

        {/* Displaying percentage permanently */}


        <div className="item-content">
          <h1 className='item-title'>
            {item?.ItemInfo?.Title?.DisplayValue.split(/[,\s\n-]+/).slice(0, 7).join('\n')}
          </h1>

          {item?.Offers?.Listings?.map((itemPrice) => {
            const amount = itemPrice?.Price?.Amount; // Get the amount
            const formattedAmount = Number(amount).toLocaleString('en-IN'); // Format the amount with commas

            return (
              <p key={item?.ASIN} className='item-price'>
                ₹ {formattedAmount} {/* Display the formatted amount */}
              </p>
            );
          })}


          {/* Button aligned to the bottom */}
          <div className="button-container">
            <button className='buy-now-btn' onClick={scrollToTop}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  ));

  return <div className='item-page'>{offerItems}</div>;
}
