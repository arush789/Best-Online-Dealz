import React from 'react'
import { Link } from "react-router-dom";

export default function OfferItems(props){

    const offerItems = props.data.map((item) => (
        <Link className='item-link'>
            <div key={item.id} className='item-container' >
                <div className='item-img-div'>
                    <img src = {item.imageUrl} className='item-img'/>
                </div>
                <h1 className='item-title'>{item.title}</h1>
            </div>
        </Link>
    ))

    return(
        <div className='item-page'>
            {offerItems}
        </div>
    )
}
