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
            'https://webservices.amazon.in/paapi5/getitems',
            {
                'ItemIds': [
                    'B09G9FPGTN'
                ],
                'Resources': [
                    'BrowseNodeInfo.BrowseNodes',
                    'BrowseNodeInfo.BrowseNodes.Ancestor',
                    'BrowseNodeInfo.BrowseNodes.SalesRank',
                    'BrowseNodeInfo.WebsiteSalesRank',
                    'Images.Primary.Small',
                    'Images.Primary.Large',
                    'ItemInfo.ByLineInfo',
                    'ItemInfo.ContentInfo',
                    'ItemInfo.ContentRating',
                    'ItemInfo.Classifications',
                    'ItemInfo.ExternalIds',
                    'ItemInfo.Features',
                    'ItemInfo.ManufactureInfo',
                    'ItemInfo.ProductInfo',
                    'ItemInfo.TechnicalInfo',
                    'ItemInfo.Title',
                    'ItemInfo.TradeInInfo'
                ],
                'PartnerTag': 'catchkaps0e-21',
                'PartnerType': 'Associates',
                'Marketplace': 'www.amazon.in'
            },
            {
                headers: {
                    // 'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    // 'Access-Control-Allow-Methods': '*',
                    // 'Access-Control-Allow-Origin': '*',
                    // 'Host': 'webservices.amazon.in',
                    // 'Accept': 'application/json, text/javascript',
                    // 'Accept-Language': 'en-US',
                    // 'Content-Type': 'application/json; charset=UTF-8',
                    // 'X-Amz-Date': '20231229T135724Z',
                    // 'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems',
                    // 'Content-Encoding': 'amz-1.0',
                    'Authorization': 'AWS4-HMAC-SHA256 Credential=AKIAI46JMULHWNX6X66A/20231229/eu-west-1/ProductAdvertisingAPI/aws4_request SignedHeaders=content-encoding;host;x-amz-date;x-amz-target  Signature=ef460e09ad2fc4c529437a13cec6878617ac132d79edd5088efb8df8b0fcbab2'
                }
            }
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