import React, { lazy, Suspense } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import Deals from "./Pages/Deals";
import TopPicks from "./Pages/TopPicks";
import Budget from "./Pages/Budget";
import { Categories, Category } from "./Pages/Categories";
import Search from "./Pages/Search";
import Lookup from "./Pages/Lookup";
import OfferDetail from "./Pages/OfferDetail";
import { About, Contact, Disclaimer, HowWePick, NotFound } from "./Pages/Info";

// Admin pages pull in MUI and the database client, so they load only when
// visited and never weigh down the public site.
const SignIn = lazy(() => import("./Pages/Login.jsx"));
const Management = lazy(() => import("./Pages/Management.jsx"));
const managementLoader = (args) => import("./Pages/Management.jsx").then((m) => m.loader(args));

function Admin({ children }) {
  return (
    <div className="admin-shell">
      <Suspense fallback={<div style={{ padding: 40 }}>Loading…</div>}>{children}</Suspense>
    </div>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="deals" element={<Deals />} />
        <Route path="top" element={<TopPicks />} />
        <Route path="best-deals" element={<Navigate to="/top" replace />} />
        <Route path="budget" element={<Budget />} />
        <Route path="categories" element={<Categories />} />
        <Route path="category/:slug" element={<Category />} />
        <Route path="search" element={<Search />} />
        <Route path="lookup" element={<Lookup />} />
        <Route path="offers/:id" element={<OfferDetail />} />
        <Route path="how-we-pick" element={<HowWePick />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="disclaimer" element={<Disclaimer />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/login" element={<Admin><SignIn /></Admin>} />
      <Route path="/management" element={<Admin><Management /></Admin>} loader={managementLoader} />
    </>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
