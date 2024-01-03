import axios from "axios";
import React, { Suspense, useEffect, useState } from "react";
import { Await, useParams } from "react-router";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import OfferItems from "../Components/OfferItems";

export default function OfferDetail() {
    const params = useParams();
    const [item, setItem] = useState();
    const [moreItems, setMoreItems] = useState([]);
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

        axios.get('https://bodz-server.vercel.app/api/getItems')
            .then(res => {
                const allItems = res?.data?.items?.ItemsResult?.Items;

                if (allItems && allItems.length > 0) {
                    // Shuffle the array to get a random order
                    const shuffledItems = allItems.sort(() => Math.random() - 0.5);

                    // Take the first four items
                    const randomFourItems = shuffledItems.slice(0, 4);

                    setMoreItems(randomFourItems);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }, [params.id]);

    return (
        <>
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
                                            <div className="offer-title-div">
                                                <h1 className="offer-title">{itemDetail?.ItemInfo?.Title?.DisplayValue.split(',').slice(0, 3).join('\n')}</h1>
                                            </div>
                                            <div className="offer-description-div">
                                                {itemDetail?.ItemInfo?.Features?.DisplayValues.slice(0, 2).map((itemDetailInfo, index) => (
                                                    <ul key={index} className="offer-description-ul">
                                                        <li key={index} className="offer-description">{itemDetailInfo}</li>
                                                    </ul>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="offer-price-div">
                                            {
                                                itemDetail?.Offers
                                                    ?
                                                    itemDetail?.Offers?.Listings?.map((itemPrice, index) => (
                                                        <div key={index}>
                                                            <p className="og-price">{itemPrice?.SavingBasis?.DisplayAmount}</p>
                                                            <span>(-{itemPrice?.Price?.Savings?.Percentage}%)</span>
                                                            <p className="offer-price">₹ {itemPrice?.Price?.Amount}</p>
                                                        </div>
                                                    ))
                                                    :
                                                    <p>Please check the price on Amazon</p>
                                            }
                                            <Link to={itemDetail?.DetailPageURL} target="_blank" className="buy-now-btn">Buy Now</Link>
                                            <p>
                                                Please be aware that product prices may vary at times,
                                                attributed to factors such as different sellers or concluded
                                                promotional offers.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </Await>
                )}
            </Suspense>

            <div style={{ position: "relative", minHeight: "100vh" }}>
                <h1 className="item-header">More Offers</h1>
                <OfferItems data={moreItems} />
            </div>
        </>
    );
}
