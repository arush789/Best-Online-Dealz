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
    TextField,
    styled
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';


import DeleteIcon from '@mui/icons-material/Delete';

import { getTable, delRow , addRow} from "../Server/api";

export function loader() {
    return defer({ rows: getTable()})
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
    const [row , setRow] = React.useState({
        name : "",
        asin : ""
    })

    

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    }

    const handleAdd = (id , name ,asin) => {
        setOpen(false);
        addRow(id , name ,asin)
    }

    const handleNameChange = (event) => {
        setRow(prevRow => (
            {
                ...prevRow,
                name: event.target.value
            } 
        ))
    }
    const handleAsinChange = (event) => {
        setRow(prevRow => (
            {
                ...prevRow,
                asin : event.target.value
            } 
        ))
    }
    
    return (
        <>
            <div>
                <Button variant="outlined" onClick={handleClickOpen}>
                    <AddCircleIcon />
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
                    <TextField id="outlined-basic" label="Name" variant="outlined" onChange={handleNameChange}/>
                    <TextField id="outlined-basic" label="Asin" variant="outlined" onChange={handleAsinChange}/>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => handleAdd(row.name,row.asin)}>
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
                    <Suspense fallback={<></>}>
                        <Await resolve={rows.rows}>
                            {(rows) => (
                                rows.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.name}</TableCell>
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