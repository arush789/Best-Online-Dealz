import React from 'react'
import { Link } from "react-router-dom";

export default function OfferItems(props){

    const offerItems = props.data.map((item) => (
        <Link key={item.id} className='item-link' to={`offers/${item.id}`}>
            <div className='item-container' >
                <div className='item-img-div'>
                    <img src = {item.imageUrl} className='item-img'/>
                </div>
                <h1 className='item-title'>{item.title}</h1>
                <p className='item-more'>More...</p>
            </div>
        </Link>
    ))

    return(
        <div className='item-page'>
            {offerItems}
        </div>
    )
}
