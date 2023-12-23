import React, { Suspense } from "react";
import { defer, useLoaderData, Await } from "react-router-dom"
import { getAllOffers } from "../Server/api";
import OfferItems from "../Components/OfferItems";
import myImage from "../../public/assets/images/home-img/home-img-3.png"

export function loader() {
    return defer({ offers: getAllOffers() })
}

export default function Home() {
    const data = useLoaderData()
    return (
        <div>
            <img src={myImage} className="home-img"/>
            <h1 className="item-header">Offers</h1>
        <Suspense fallback={<h1>Loading...</h1>}>
            <Await resolve={data.offers}>
                {(offers) => (
                    
                    <OfferItems data={offers}/>
                )}
            </Await>
        </Suspense>
        </div>
    )
}