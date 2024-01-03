import axios from "axios";
import React, { useEffect, useState } from "react";
import OfferItems from "../Components/OfferItems";
import { Select, FormControl, MenuItem, OutlinedInput } from "@mui/material";

const ITEM_HEIGHT = 48;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 ,
            width: 250,
        },
    },
};


export default function Home() {
    const [offer, setOffer] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);

    useEffect(() => {
        axios.get('https://bodz-server.vercel.app/api/getItems')
            .then(res => {
                setOffer(res?.data?.items?.ItemsResult?.Items);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <div style={{ position: "relative", minHeight: "100vh" }}>
            <div className="home-page-offer">
                <h1 className="item-header">Offers</h1>
                <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
                    <Select
                        multiple
                        displayEmpty
                        value={selectedValues}
                        onChange={(event) => setSelectedValues(event.target.value)}
                        input={<OutlinedInput />}
                        renderValue={(selected) => {
                            if (!Array.isArray(selected)) {
                                return <em>Catogeries</em>;
                            }

                            if (selected.length === 0) {
                                return <em>Catogeries</em>;
                            }

                            return selected.join(', ');
                        }}
                        MenuProps={MenuProps}
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        {/* <MenuItem disabled value="">
                            <em>Placeholder</em>
                        </MenuItem> */}
                        {offer.map(item => (
                            <MenuItem>
                                {item?.ItemInfo?.Classifications?.Binding?.DisplayValue}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <OfferItems data={offer} />
        </div>
    );
}
