import React, { Suspense } from "react";
import { defer, Await, useLoaderData } from "react-router";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";

import { getTable } from "../Server/api";

export function loader() {
    return defer({ rows: getTable()})
}
  
export default function Management() {
    const rows = useLoaderData();
    // console.log(rows)
    return (
        <TableContainer component={Paper} >
            <Table sx={{ minWidth: 250 }} aria-label="simple table">
                
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>ASIN</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    <Suspense fallback={<></>}>
                        <Await resolve={rows.rows}>
                            {(rows) => {
                                rows.map((row) => (
                                    console.log(row.product_name)
                                    // <TableRow key={row.id}>
                                    //     <TableCell>Hallo</TableCell>
                                    //     <TableCell>{row.product_name}</TableCell>
                                    //     <TableCell>{row.asin}</TableCell>
                                    // </TableRow>
                                ))
                            }}
                        </Await>
                    </Suspense>
                </TableBody>
            </Table>
        </TableContainer>
    )
}