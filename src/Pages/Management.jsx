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
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    styled,
    Alert
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { getTable, delRow, addRow } from "../Server/api";


export function loader() {
    return defer({ rows: getTable() })
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function Management() {

    const rows = useLoaderData();

    const [open, setOpen] = React.useState(false);
    const [row, setRow] = React.useState({
        name: "",
        asin: ""
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [selectedRowId, setSelectedRowId] = React.useState(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setDeleteDialogOpen(false);
        setSelectedRowId(null);
    }

    const handleAdd = () => {
        setOpen(false);
        if (row.name === "" || row.asin === "") {
            alert("Name and AsinCode should be filled.")
        } else {
            addRow(row.name, row.asin);
        }
    }

    const handleNameChange = (event) => {
        setRow(prevRow => ({
            ...prevRow,
            name: event.target.value
        }))
    }

    const handleAsinChange = (event) => {
        setRow(prevRow => ({
            ...prevRow,
            asin: event.target.value
        }))
    }

    const handleDeleteClick = (id) => {
        setDeleteDialogOpen(true);
        setSelectedRowId(id);
    }

    const handleDeleteConfirm = () => {
        delRow(selectedRowId);
        setDeleteDialogOpen(false);
    }

    return (
        <>
            <div className="add-product-btn">
                <Button variant="outlined" onClick={handleClickOpen} >
                    <span>Add Products</span><AddCircleIcon />
                </Button>
            </div>

            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Modal title
                </DialogTitle>
                <DialogContent dividers>
                    <DialogContent dividers>
                        <h1>Product Name</h1>
                        <TextField id="outlined-basic" label="Name" variant="outlined" onChange={handleNameChange} />
                        <h1>ASIN</h1>
                        <TextField id="outlined-basic" label="Asin" variant="outlined" onChange={handleAsinChange} />
                    </DialogContent>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleAdd}>
                        ADD
                    </Button>
                </DialogActions>
            </BootstrapDialog>

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
                        <Suspense fallback={<TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>}>
                            <Await resolve={rows.rows}>
                                {(rows) => (
                                    rows.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.asin}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => handleDeleteClick(row.id)}>
                                                    <DeleteIcon className="table-delete-btn" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </Await>
                        </Suspense>
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
