import React from 'react';
import { Link } from 'react-router-dom';

export default function OtherOfferItems(props) {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const offerItems = props.data.map((item) => (
        <Link key={item?.id} className='item-link' to={`/other-offers/${item?.id}`} onClick={scrollToTop}>
            <div className='item-container'>
                <div className='item-img-div'>
                    <img src={item?.imageurl} className='item-img' alt={item?.title} />
                </div>
                <h1 className='item-title'>
                    {item?.title}
                </h1>
                <p key={item?.ASIN} className='item-price'>{item?.price}</p>
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
