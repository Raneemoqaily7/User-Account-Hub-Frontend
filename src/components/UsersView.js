import React, { useCallback, useMemo, useState } from "react";
import { Button, Grid } from "@mui/material";
import { AgGridReact } from 'ag-grid-react';

import axios from "axios";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";


import AlertDialog from "./Dialog"
import NewUser from "./NewUser";
import { GridApi } from "ag-grid-community";



function UserView() {

    const [users, setUsers] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [searchResult, setsearchResult] = useState(null)
    const [selectedUsers,setSelectedUsers] =useState()
    const handleShow = () => setShowModal(true)
    const handleClose = () => setShowModal(false)

    const [columnDefs, setColumnDefs] = useState([
        {
            field: 'username',
            minWidth: 190,
            checkboxSelection: true,
            headerCheckboxSelection: true,

        },
        {
            field: "firstName"
        },
        {
            field: "lastName"
        },
        {
            field: "email"
        },
        {
            field: "date_of_Birth"
        },
        {
            field: "DateTime_UTC"
        },
        {
            field: "server_DateTime"
        },
        {
            field: "Update_DateTime_UTC"
        },
        {
            field: "gender"
        },
        {
            field: "status"
        },


    ]);



    const defaultColDef = useMemo(() => {
        return {
            sortable: true,
            filter: true,
            resizable: true,
            floatingFilter: true,
        };
    }, []);
    let gridApi;

    

    const onGridReady = useCallback((params) => {
        gridApi = params.api
        axios.get('http://127.0.0.1:8000/api/users/')
            .then((response) => {
                return response.data;
            })
            .then(data => {
                console.log(data)
                setUsers(data);
            })
            .catch(error => console.error(error));
    }, []);


    // function to search for the user by id or username or email
    const searchHandler = (event) => {

        axios.get(`http://127.0.0.1:8000/api/users/${inputValue}/`)
            .then((response) => {
                setsearchResult([response.data])
                console.log(response.data, "seaaaarch")
            }

            )



    }

    const onSelectionChanged =() =>{
        const selectedNodes = gridApi.getSelectedNodes()
        const selectedaData = selectedNodes.map(node=>node.data)
        setSelectedUsers(selectedaData)

    }

    const gridOptions ={
        rowSelection: 'multiple',
        onSelectionChanged : onSelectionChanged
    }

    const handleDelete = () =>{
        let ids =[]
        selectedUsers.map(user=>{
            ids.push(user.id)
        })
        const body={
            data:{
                "users_id":ids
            }

        }
        axios.delete('http://127.0.0.1:8000/api/deleteuser/', body)
      .then(() => {
        const result = users.filter(item => !selectedUsers.includes(item));
        setUsers(result)
        alert("deleted successfully!!")
      })
    }




    return (
        <>
            <div className="container">
                <div>
                    <h3> Search User</h3>
                    <input
                        style={{ width: '50%' }}
                        type="text"
                        value={inputValue}
                        placeholder="search by username, email or 
                    user ID"
                        onChange={(e) => setInputValue(e.target.value)}

                    />

                </div>
                <Button onClick={handleDelete}>delete</Button>
                <Button onClick={searchHandler}>   Search </Button>

                <div className="grid-container">

                    {searchResult ? (
                        <div className="ag-theme-alpine-dark" style={{ height: '200px', width: '100%' }}>
                            <AgGridReact
                                columnDefs={columnDefs}
                                rowData={searchResult}
                                domLayout='autoHeight'
                                pagination={false}
                            />
                        </div>
                    )
                        :
                        <div className="ag-theme-alpine-dark" style={{ height: '500px', width: '100%' }}>
                            <AgGridReact rowData={users} gridOptions={gridOptions} columnDefs={columnDefs} pagination={true} paginationPageSize={10} defaultColDef={defaultColDef} onGridReady={onGridReady} />
                        </div>
                    }

                    {/* <Grid>
                        <NewUser showModal={showModal} handleClose={handleClose} />
                        <Button onClick={handleShow} variant="contained" color="primary" > Add User</Button>
                    </Grid> */}

                </div>
            </div>
        </>

    )
}
export default UserView