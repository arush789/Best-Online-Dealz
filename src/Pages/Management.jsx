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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide
} from "@mui/material";


import DeleteIcon from '@mui/icons-material/Delete';

import { getTable } from "../Server/api";

export function loader() {
    return defer({ rows: getTable()})
}
  
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function Management() {
    const rows = useLoaderData();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // console.log(rows)
    return (
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
                                        <TableCell><Button onClick={handleClickOpen}><DeleteIcon className="table-delete-btn"/></Button></TableCell>
                                        <Dialog
                                            open={open}
                                            TransitionComponent={Transition}
                                            keepMounted
                                            onClose={handleClose}
                                            aria-describedby="alert-dialog-slide-description"
                                        >
                                            <DialogTitle>{"Are you sure?"}</DialogTitle>
                                            {/* <DialogContent>
                                                <DialogContentText id="alert-dialog-slide-description">
                                                    Let Google help apps determine location. This means sending anonymous
                                                    location data to Google, even when no apps are running.
                                                </DialogContentText>
                                            </DialogContent> */}
                                            <DialogActions>
                                                <Button onClick={handleClose}>No</Button>
                                                <Button onClick={handleClose}>Yes</Button>
                                            </DialogActions>
                                        </Dialog>
                                    </TableRow>
                                ))
                            )}
                        </Await>
                    </Suspense>
                </TableBody>
            </Table>
        </TableContainer>
    )
}