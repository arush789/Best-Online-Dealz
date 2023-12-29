import React, { Suspense, useEffect } from "react";
import { defer, useLoaderData, Await } from "react-router-dom"
import { getAllOffers } from "../Server/api";
import OfferItems from "../Components/OfferItems";
import myImage from "/assets/images/home-img/home-img-3.png"
import axios from "axios";


export function loader() {
    return defer({ offers: getAllOffers() })
}


export default function Home() {
    const data = useLoaderData()

    useEffect(() => {

        axios.post(
            '/api/amazon-api'
        ).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <div>
            <img src={myImage} className="home-img" />
            <h1 className="item-header">Offers</h1>
            {/* <Suspense fallback={<h1>Loading...</h1>}>
                <Await resolve={data.offers}>
                    {(offers) => (

                        <OfferItems data={offers} />
                    )}
                </Await>
            </Suspense> */}
        </div>
    )
}