import React, { useCallback, useMemo, useState } from "react";
import { Button, Grid } from "@mui/material";
import { AgGridReact } from 'ag-grid-react';
import DropdownRenderer from "./DropdownRenderer"
import { StatusEnum } from "./Enum"


import axios from "axios";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";


import AlertDialog from "./Dialog"
import NewUser from "./NewUser";
import { GridApi } from "ag-grid-community";



function UsersView() {
    const [status, setStatus] = useState()
    const [users, setUsers] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [searchResult, setsearchResult] = useState(null)
    const [selectedUsers, setSelectedUsers] = useState()
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

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
            headerName: 'status',
            field: 'status',
            cellRenderer: 'dropdownRenderer',
            cellRendererParams: {
                values: Object.values(StatusEnum),
                onValueChange: (newValue) => {
                    setStatus(newValue);
                },
            },
        }

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




    const handleEdit = () => {
        if (gridApi) {
            const selectedNodes = gridApi.getSelectedNodes();
            const selectedUser = selectedNodes.length === 1 ? selectedNodes[0].data : null;
            setEditingUser(selectedUser);
        }
        setShowModal(true);
    };

    const handleAddNew = () => {
        setEditingUser(null); // Set to null to indicate a new user
        setShowModal(true);
    };
    const handleSave = (userData) => {
        if (editingUser) {
            // If editingUser is present, it means we are editing an existing user
            // Make an API call to update the user data
            axios.patch(`http://127.0.0.1:8000/api/updateuser/${editingUser.id}/`, userData)
                .then((response) => {
                    if (response.status === 200 || response.status === 204) {
                        // Successful response
                        alert('User updated successfully');
                        setShowModal(false);
                        // Fetch updated user list
                        onGridReady();
                    } else {
                        // Handle other status codes (e.g., 404, 500, etc.)
                        console.error('Failed to update user. Status code:', response.status);
                        // You might want to show an error message to the user
                        alert('Failed to update user. Please try again.');
                    }
                })
                .catch((error) => {
                    console.error('Error updating user:', error);
                    // You might want to show an error message to the user
                    alert('Error updating user. Please try again.');
                });
        } else {
            // If editingUser is null, it means we are adding a new user
            // Make an API call to add the new user
            axios.post('http://127.0.0.1:8000/api/adduser/', userData)
                .then((response) => {
                    if (response.status === 200) {
                        // Successful response
                        console.log(response.data);
                        alert('User added successfully');
                        setShowModal(false);
                        // Fetch updated user list
                        // Fetch updated user list
                        onGridReady();
                    } else {
                        // Handle other status codes
                        console.error('Failed to add user. Status code:', response.status);
                        // You might want to show an error message to the user
                        alert('Failed to add user. Please try again.');
                    }
                })
                .catch((error) => {
                    console.error('Error adding user:', error);
                    // You might want to show an error message to the user
                    alert('Error adding user. Please try again.');
                });
        }
    };

    // function to search for the user by id or username or email
    const searchHandler = (event) => {

        axios.get(`http://127.0.0.1:8000/api/users/${inputValue}/`)
            .then((response) => {
                setsearchResult([response.data])
                console.log(response.data, "seaaaarch")
            }

            )



    }

    const onSelectionChanged = () => {
        const selectedNodes = gridApi.getSelectedNodes()
        const selectedaData = selectedNodes.map(node => node.data)
        setSelectedUsers(selectedaData)

    }

    const gridOptions = {
        rowSelection: 'multiple',
        onSelectionChanged: onSelectionChanged
    }

    const handleDelete = () => {
        let ids = []
        selectedUsers.map(user => {
            ids.push(user.id)
        })
        const body = {
            data: {
                "users_id": ids
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
                    <Button onClick={searchHandler}>   Search </Button>
                </div>
                <Button onClick={handleDelete}>delete</Button>

                <Button onClick={handleAddNew}>Add New</Button>
                <Button onClick={handleEdit}>Edit</Button>

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
                            <AgGridReact rowData={users} gridOptions={gridOptions} columnDefs={columnDefs} pagination={true} paginationPageSize={10} defaultColDef={defaultColDef} onGridReady={onGridReady} frameworkComponents={{ dropdownRenderer: DropdownRenderer }} />
                        </div>
                    }

                    <NewUser showModal={showModal} handleClose={handleClose} setUsers={setUsers} />

                </div>
            </div>
        </>

    )
}
export default UsersView