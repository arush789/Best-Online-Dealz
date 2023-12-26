import React, { Suspense } from "react";
import { defer, Await, useLoaderData } from "react-router";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from "@mui/material";


import DeleteIcon from '@mui/icons-material/Delete';

import { getTable, delRow } from "../Server/api";

export function loader() {
    return defer({ rows: getTable()})
}

export default function Management() {
    const rows = useLoaderData();

    // console.log(rows)
    return (
        <>
        <Button>ADD</Button>

        <TableContainer component={Paper} >
            <Table sx={{ minWidth: 250 }} aria-label="simple table">
                
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>ASIN</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    <Suspense fallback={<></>}>
                        <Await resolve={rows.rows}>
                            {(rows) => (
                                rows.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.product_name}</TableCell>
                                        <TableCell>{row.asin}</TableCell>
                                        <TableCell><Button onClick={() => delRow(row.id)}><DeleteIcon className="table-delete-btn"/></Button></TableCell>
                                    </TableRow>
                                ))
                            )}
                        </Await>
                    </Suspense>
                </TableBody>
            </Table>
        </TableContainer>
        </>
    )
}