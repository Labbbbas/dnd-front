"use client";
import { Box, Button, Container, IconButton, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { useState, useEffect } from "react";
import BossDialog from "./components/bossesDialog";
import Alerts from "../components/alerts";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
// Axios for making HTTP requests to the backend
import axios from "axios";

export default function Bosses() {
  const columns = [
    { field: "_id", headerName: "ID", width: 50 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "cr", headerName: "CR", width: 70 },
    { field: "hp", headerName: "HP", width: 70 },
    { field: "ac", headerName: "AC", width: 70 },
    { field: "resistances", headerName: "Resistances",  flex: 1.5,},
    { field: "immunities", headerName: "Immunities", flex: 1.5,},
    { field: "abilities", headerName: "Abilities", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150, 
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleBoss({ action: "edit", bossData: params.row })}
          >
            <AutoFixHighIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => confirmDelete(params.row._id)}>
            <WhatshotIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const [action, setAction] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([ ]);
  const [openAlert, setOpenAlert] = useState(false);
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [bossData, setBossData] = useState({
    _id: null,
    name: "",
    type: "",
    cr: "",
    hp: "",
    ac: "",
    resistances: [],
    immunities: [],
    abilities: "",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bossToDelete, setBossToDelete] = useState(null);

  // Fetch the classes from the server when the component is mounted
  useEffect(() => {
    fetchBosses();
  }, []); // Empty dependency array means it runs only once when the component mounts

  // Fetch the list of classes from the backend
  const fetchBosses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/v1/bosses");
      setRows(response.data); // Set the fetched classes to the state
    } catch (error) {
      console.error("Error fetching bosses", error);
      // Display an alert if there is an error
      setAlert({
        message: "Failed to load bosses",
        severity: "error",
      });
      setOpenAlert(true); // Open the alert
    }
  };


  const handleBoss = ({ action, bossData }) => {
    setAction(action);
    setOpenDialog(true);
    setBossData(
      action === "add"
        ? {
            _id: null,
            name: "",
            type: "",
            cr: "",
            hp: "",
            ac: "",
            resistances: [],
            immunities: [],
            abilities: "",
          }
        : bossData 
    );

  };

  const deleteBoss = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/v1/bosses/${id}`);
      setRows(rows.filter((row) => row._id !== id)); // Remove the deleted class from the table
      setAlert({
        message: "Boss deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting boss: ", error);
      setAlert({
        message: "Failed to delete boss",
        severity: "error",
      });
    }
    setOpenAlert(true); // Open the alert with success or error message
  };

  const confirmDelete = (id) => {
    setBossToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <Container maxWidth="xl" disableGutters>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 2 }}>
        <Button
          startIcon={<AddCircleIcon />}
          variant="contained"
          sx={{ borderRadius: 3 }}
          onClick={() => handleBoss({ action: "add" })}
        >
          Add Boss
        </Button>
      </Box>

      <Paper
        sx={{
          padding: 2,
          borderRadius: 2,
          maxWidth: "80%",
          margin: "0 auto",
          height: 500,
        }}
      >
        <DataGrid
          columns={columns}
          rows={rows}
          getRowId={(row) => row._id}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10]}

        />
      </Paper>

      <BossDialog
        open={openDialog}
        setOpen={setOpenDialog}
        bossData={bossData}
        setBossData={setBossData}
        action={action}
        rows={rows}
        setRows={setRows}
        setAlert={setAlert}
        setOpenAlert={setOpenAlert}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to kill it? D:, This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={deleteBoss}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Alerts
        open={openAlert}
        setOpen={setOpenAlert}
        alert={alert}
        setAlert={setAlert}
      />
    </Container>
  );
}
