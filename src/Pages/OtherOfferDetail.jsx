import React, { Suspense } from "react";
import { Await, defer, useLoaderData } from "react-router";
import { Link } from "react-router-dom";
import { getOtherOfferDetail } from "../Server/api";

export async function loader({ params }) {
    return defer({ row: getOtherOfferDetail(params.id) });
}

export default function OtherOfferDetail() {
    const data = useLoaderData()
    return (
        <>
            <Suspense fallback={<h1>loading</h1>}>
                <Await resolve={data.row}>
                    {(row) => (
                        <div className="offer-page">
                            {/* <div className="offer-img-div">
                                <img className="offer-img" src={row[0].imageurl} alt="" />
                            </div> */}
                            <div className="offer-info-price-div">
                                <div className="offer-info">
                                    <div className="offer-title-div">
                                        <h1 className="offer-title">{row[0].title}</h1>
                                    </div>
                                    <div className="offer-description-div">
                                        <ul className="offer-description-ul">
                                            <li className="offer-description">{row[0].description}</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="offer-price-div">
                                    <div>
                                        {/* <p className="og-price">{itemPrice?.SavingBasis?.DisplayAmount}</p>
                                        <span>(-{itemPrice?.Price?.Savings?.Percentage}%)</span> */}
                                        <p className="offer-price">₹ {row[0].price}</p>
                                    </div>
                                    <Link to={row[0].affiliatelink} target="_blank" className="buy-now-btn">Buy Now</Link>
                                    <p style={{ color: "red" }}>
                                        *Please be aware that product prices may vary at times,
                                        attributed to factors such as different sellers or concluded
                                        promotional offers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                </Await>
            </Suspense>
        </>
    )
}