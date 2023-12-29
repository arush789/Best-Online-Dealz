import React, { Suspense, useEffect } from "react";
import { defer, useLoaderData, Await } from "react-router-dom"
import { getAllOffers } from "../Server/api";
import OfferItems from "../Components/OfferItems";
import myImage from "/assets/images/home-img/home-img-3.png"
import axios from "axios";
const amazonPaapi = require('amazon-paapi');

export function loader() {
    return defer({ offers: getAllOffers() })
}


export default function Home() {
    const data = useLoaderData()

    useEffect(() => {

        // axios.post(
        //     '/api/amazon-api'
        // ).then(res => {
        //     console.log(res.data)
        // }).catch(err => {
        //     console.log(err)
        // })
        const commonParameters = {
            AccessKey: 'AKIAI46JMULHWNX6X66A',
            SecretKey: 'QcOsExfSBxnFSSBvkD7+fBOiQPOT6727as35Eu4r',
            PartnerTag: 'catchkaps0e-21', // yourtag-20
            PartnerType: 'Associates', // Default value is Associates.
            Marketplace: 'www.amazon.in', // Default value is US. Note: Host and Region are predetermined based on the marketplace value. There is no need for you to add Host and Region as soon as you specify the correct Marketplace value. If your region is not US or .com, please make sure you add the correct Marketplace value.
          };
          const requestParameters = {
            ItemIds: ['B00X4WHP5E', 'B00ZV9RDKK'],
            ItemIdType: 'ASIN',
            Condition: 'New',
            Resources: [
              'Images.Primary.Medium',
              'ItemInfo.Title',
              'Offers.Listings.Price',
            ],
          };
          
          /** Promise */
          amazonPaapi
            .GetItems(commonParameters, requestParameters)
            .then((data) => {
              // do something with the success response.
              console.log(data);
            })
            .catch((error) => {
              // catch an error.
              console.log(error);
            });

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