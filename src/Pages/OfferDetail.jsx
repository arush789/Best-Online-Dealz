import React, { Suspense } from "react";
import { defer, useLoaderData, Await } from "react-router";
import { getOffer } from "../Server/api";

export function loader({ params }) {
    return defer({ offer : getOffer(params.id) })
}

export default function OfferDetail() {
    const offer = useLoaderData()

    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            <Await resolve={offer.offer}>
                {(offer) => (
                    <div className="offer-page">
                        <div className="offer-img-div">
                            <img className="offer-img" src={offer.imageUrl} alt="" />
                        </div>
                        <div className="offer-info">
                            <h1>{offer.title}</h1>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                            <div>
                                <p>₹{offer.ogPrice}</p>
                                <p>₹{offer.offerPrice}</p>
                            </div>
                            <button>Buy Now</button>
                        </div>
                    </div>
                )}
            </Await>
        </Suspense>
    )
}