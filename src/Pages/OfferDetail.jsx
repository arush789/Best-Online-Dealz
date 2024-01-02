import axios from "axios";
import React, { Suspense, useEffect, useState } from "react";
import { Await, useParams } from "react-router";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import OfferItems from "../Components/OfferItems";

export default function OfferDetail() {
    const params = useParams();
    const [item, setItem] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`https://bodz-server.vercel.app/api/getItem/${params.id}`)
            .then(res => {
                setItem(res?.data?.item?.ItemsResult?.Items[0]);
                setLoading(false); // Set loading to false when data is fetched
            })
            .catch(err => {
                console.log(err);
                setLoading(false); // Set loading to false on error
            });
    }, [params.id]);
    console.log(item)

    return (
        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><CircularProgress /></div>}>
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                    <CircularProgress />
                </div>
            ) : (
                <Await resolve={item}>
                    {(itemDetail) => (
                        <>
                            <div className="offer-page">
                                <div className="offer-img-div">
                                    <img className="offer-img" src={itemDetail?.Images?.Primary?.Large?.URL} alt="" />
                                </div>
                                <div className="offer-info-price-div">
                                    <div className="offer-info">
                                        <h1>{itemDetail?.ItemInfo?.Title?.DisplayValue.split(',').slice(0, 3).join('\n')}</h1>
                                        {itemDetail?.ItemInfo?.Features?.DisplayValues.slice(0, 2).map((itemDetailInfo, index) => (
                                            <ul className="offer-description-ul">
                                                <li key={index} className="offer-description">{itemDetailInfo}</li>
                                            </ul>
                                        ))}
                                    </div>
                                    <div className="offer-price-div">
                                        {itemDetail?.Offers?.Listings?.map((itemPrice, index) => (
                                            <div key={index}>
                                                <p className="og-price">{itemPrice?.SavingBasis?.DisplayAmount}</p>
                                                <span>(-{itemPrice?.Price?.Savings?.Percentage}%)</span>
                                                <p className="offer-price">₹ {itemPrice?.Price?.Amount}</p>
                                                <Link to={itemDetail?.DetailPageURL} className="buy-now-btn">Buy Now</Link>
                                                <p>
                                                    Please be aware that product prices may vary at times,
                                                    attributed to factors such as different sellers or concluded
                                                    promotional offers.
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </Await>
            )}
        </Suspense>
    );
}
