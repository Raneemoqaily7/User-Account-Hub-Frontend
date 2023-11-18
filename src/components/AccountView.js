

import React, { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import {StatusEnum} from "./Enum";
import DropdownRenderer from "./DropdownRenderer"
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, Grid } from "@mui/material";
import NewAccount from "./NewAccount";


function AccountView (){
    ///////////////////////////////////
    const [selectedUsers, setSelectedUsers] = useState();
    const [selectedAccount, setSelectedAccount] = useState();
    const [accounts,setAccount] =useState([])
    const[editingAccount,setEditingAccount] =useState(null)
    const [inputValue, setInputValue] = useState("");
    const [searchResult, setsearchResult] = useState(null);
    const [status,setStatus]=useState()
    const [title, setTitle] = useState("Add New Account");
    const [showModal, setShowModal] = useState(false);
const handleClose = () => setShowModal(false);
const handleShow = () => setShowModal(true);
    const [columnDefs, setColumnDefs] = useState([
        {
          field: "accountNumber",
          minWidth: 190,
          checkboxSelection: true,
          headerCheckboxSelection: true,
        },
        {
          field: "balance",
        },
        {
          field: "currency",
        },
        {
          field: "server_DateTime",
        },
        {
          field: "dateTime_UTC",
        },
        {
          field: "update_DateTime_UTC",
        },
        
        
        {
          headerName: "status",
          field: "status",
          cellRendererParams: {
            values: Object.values(StatusEnum),
            onValueChange: (newValue) => {
              setStatus(newValue);
            },
          },
        },
      ]);

     


      const searchHandler = (event) => {
        if (inputValue === "" || inputValue === null || inputValue === undefined) {
          setsearchResult(accounts);
        } else {
          axios
            .get(`http://127.0.0.1:8000/api/accountdetail/${inputValue}/`)
            .then((response) => {
              setsearchResult([response.data]);
              console.log(response.data, "seaaaarch");
            });
        }
      };

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
        gridApi = params.api;
        axios
      .get("http://127.0.0.1:8000/api/accounts/")
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        console.log(data);
        setAccount(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedaData = selectedNodes.map((node) => node.data);
    setSelectedAccount(selectedaData);
  };

  const gridOptions = {
    rowSelection: "multiple",
    onSelectionChanged: onSelectionChanged,
  };

  const handleEdit = () => {
    if (selectedAccount !== undefined) {
      if (selectedAccount.length === 1) {
        console.log("Edit ....");
        setTitle("Edit Account");
        setEditingAccount(selectedAccount[0]);
        setShowModal(true);
      } else if (selectedAccount.length === 0) {
        alert("Please select account to edit");
      } else {
        alert("Please select only one account to edit");
      }
    } else {
      alert("Please select account to edit");
    }
  };

  const handleDelete = () => {
    let ids = [];
    if (selectedUsers !== undefined) {
      selectedUsers.map((account) => {
        ids.push(account.id);
      });
      const body = {
        data: {
          accounts_id: ids,
        },
      };
      axios.delete("http://127.0.0.1:8000/api/deleteaccounts/", body).then(() => {
        const result = accounts.filter((item) => !selectedUsers.includes(item));
        setAccount(result);
        alert("deleted successfully!!");
      });
    } else {
      alert("Please select user to delete");
    }
  };
  const handleAddNew = () => {
   setEditingAccount(null); 
    setTitle("Add New Deal");
    setShowModal(true);
  };





    return(
      <div className="container">
        <div>
          <h3> Search Account</h3>
          <input
            style={{ width: "50%" }}
            type="text"
            value={inputValue}
            placeholder=" search by user ID, account 
            ID or account number"
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button onClick={searchHandler}> Search </Button>
        </div>
        <Button onClick={handleDelete}>delete</Button>
        <Button onClick={handleAddNew}>Add New</Button>
        <Button onClick={handleEdit}>Edit</Button>
      <div className="grid-container">
      
             
      {searchResult ? (
            <div
              className="ag-theme-alpine-dark"
              style={{ height: "200px", width: "100%" }}>
              <AgGridReact
                columnDefs={columnDefs}
                rowData={searchResult}
                domLayout="autoHeight"
                pagination={false}
              />
            </div>
          ) : (
            <div
              className="ag-theme-alpine-dark"
              style={{ height: "500px", width: "100%" }}>
              <AgGridReact
                rowData={accounts}
                gridOptions={gridOptions}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
             
              />
            </div>
          )}

<NewAccount
            showModal={showModal}
            title={title}
            handleClose={handleClose}
            
            editingAccount={editingAccount}
          />
              </div>
              </div>
    )
}
export default AccountView ;