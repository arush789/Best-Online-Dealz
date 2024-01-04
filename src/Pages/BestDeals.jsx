import React, { useState, useEffect } from "react";
import axios from "axios";
import OfferItems from "../Components/OfferItems";
import Pagination from "@mui/material/Pagination";
import { CircularProgress, Typography } from "@mui/material";

export default function BestDeals() {
  const [offer, setOffer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://bodz-server.vercel.app/api/getItems?page=${currentPage}`)
      .then((res) => {
        const filteredItems =
          res?.data?.items?.ItemsResult?.Items.filter(
            (item) =>
              item?.Offers?.Listings[0]?.Price?.Savings?.Percentage > 30
          ) || [];
        setOffer(filteredItems);

        const receivedTotalPages = res?.data?.totalPages;
        setTotalPages(receivedTotalPages);
      })
      .catch((err) => {
        console.log(err);
        setError("Error loading best deals. Please refresh the page.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <h1 className="item-header">Best Deals</h1>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "70vh",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          {error ? (
            <Typography
              variant="body1"
              color="error"
              style={{ textAlign: "center", margin: "20px" }}
            >
              {error}
            </Typography>
          ) : (
            <>
              <OfferItems data={offer} />
              <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" , marginBottom : "40px" }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
