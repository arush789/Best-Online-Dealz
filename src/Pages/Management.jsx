import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";
import { sql } from "@vercel/postgres";


// const rows = [];
async function vercel() {
    const { rows } = await sql`SELECT * FROM Offers `;
    return rows;
}

export default function Management() {
    console.log(vercel())
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
                    
                </TableBody>
            </Table>
        </TableContainer>
    )
}