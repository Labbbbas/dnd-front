"use client";
// React hooks for state management
import { useState, useEffect } from "react";

// Import necessary Material UI components for layout and UI elements
import { Box, Button, Container, IconButton, Paper } from "@mui/material";

// Import icons for actions like editing and deleting
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// Import DataGrid component for displaying data in a table
import { DataGrid } from "@mui/x-data-grid";

// Import custom components for dialogs and alerts
import CampaignDialog from "./components/campaign-dialog";
import Alerts from "../components/alerts";

// Axios for making HTTP requests to the backend
import axios from "axios";
import { Campaign } from "@mui/icons-material";

export default function Campaigns() {
  // Define columns for the DataGrid table
  // Each column has an appropriate width and flex to make it look aesthetic
    const columns = [
        {
            field: "title", 
            headerName: "Campaign",
            width: 140, 
            sortable: false, // Disable sorting
            disableColumnMenu: true, // Disable column menu
            headerAlign: "center", 
            align: "center",
            renderHeader: () => (
                <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Campaign
                </Box>
            ),
            renderCell: (params) => (
                // So it doesn't look so crowded
                <Box sx={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
                {params.value}
                </Box>
            ),
        },
        {
            field: "dm", 
            headerName: "Dungeon Master", 
            width: 140, 
            sortable: false, // Disable sorting
            disableColumnMenu: true, // Disable column menu
            headerAlign: "center", 
            align: "center",
            renderHeader: () => (
                <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Dungeon Master
                </Box>
            ),
            renderCell: (params) => (
                <Box sx={{ 
                    whiteSpace: 'normal', 
                    wordWrap: 'break-word', 
                    textAlign: 'justify', 
                    paddingTop: '8px', 
                    paddingBottom: '8px' 
                }}>
                {params.value}
                </Box>
            ),
        },
        {
            field: "description", 
            headerName: "Description", 
            width: 180, 
            sortable: false, // Disable sorting
            disableColumnMenu: true, // Disable column menu
            headerAlign: "center", 
            align: "left", 
            renderHeader: () => (
                <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Description
                </Box>
            ),
            renderCell: (params) => (
                <Box sx={{ 
                    whiteSpace: 'normal', 
                    wordWrap: 'break-word', 
                    textAlign: 'justify', 
                    paddingTop: '8px', 
                    paddingBottom: '8px' 
                }}>
                {params.value}
                </Box>
            ),
        },
        {
        field: "status", 
        headerName: "Status", 
        width: 100, 
        sortable: false, // Disable sorting
        disableColumnMenu: true, // Disable column menu
        headerAlign: "center", 
        align: "center", 
        renderHeader: () => (
            <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Status
            </Box>
        ),
        renderCell: (params) => (
            <Box sx={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
            {params.value}
            </Box>
        ),
        },
        {
        field: "startDate", 
        headerName: "Start Date", 
        width: 120, 
        sortable: false, // Disable sorting for this column
        disableColumnMenu: true, // Disable the column menu
        headerAlign: "center", 
        align: "center", 
        renderHeader: () => (
            <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Start Date
            </Box>
        ),
        renderCell: (params) => (
            <Box sx={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
                {/* Format the date if it exists */}
                {params.value ? new Date(params.value).toLocaleDateString() : 'No Date'} 
            </Box>
            ),
        },
        {
        field: "endDate", 
        headerName: "End Date", 
        width: 120, 
        sortable: false, // Disable sorting for this column
        disableColumnMenu: true, // Disable the column menu
        headerAlign: "center", 
        align: "center", 
        renderHeader: () => (
            <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                End Date
            </Box>
        ),
        renderCell: (params) => (
            <Box sx={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
                {/* Format the date if it exists */}
                {params.value ? new Date(params.value).toLocaleDateString() : 'No Date'} 
            </Box>
            ),
        },
        {
        field: "pc", 
        headerName: "Player Characters", 
        width: 200, 
        sortable: false, // Disable sorting
        disableColumnMenu: true, // Disable column menu
        headerAlign: "center", 
        align: "center", 
        renderHeader: () => (
            <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Player Characters
            </Box>
        ),
        renderCell: (params) => (
            <Box sx={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
            {params.value}
            </Box>
        ),
        },
        {
            field: "ql", 
            headerName: "Quest Log", 
            width: 200, 
            sortable: false, // Disable sorting
            disableColumnMenu: true, // Disable column menu
            headerAlign: "center", 
            align: "justify", 
            renderHeader: () => (
                <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Quest Log
                </Box>
            ),
            renderCell: (params) => (
                <Box sx={{ 
                whiteSpace: 'normal', 
                wordWrap: 'break-word', 
                textAlign: 'justify', 
                paddingTop: '8px', 
                paddingBottom: '8px' 
                }}>
                {params.value}
                </Box>
            ),
        },
        {
        field: "actions", 
        headerName: "", 
        width: 120,
        sortable: false, // Disable sorting
        disableColumnMenu: true, // Disable column menu
        renderCell: (params) => (
            <Box sx={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
            {/* Edit button */}
            <IconButton color="primary" onClick={() => handleCampaign({ action: "edit", campaignData: params.row })}>
                <AutoFixHighIcon />
            </IconButton>
            {/* Delete button */}
            <IconButton color="secondary" onClick={() => deleteCampaign(params.row._id)}>
                <WhatshotIcon />
            </IconButton>
            </Box>
        ),
        },
    ];
    
    // State variables to manage data and UI states
    const [action, setAction] = useState(""); // Action (edit, add)
    const [openDialog, setOpenDialog] = useState(false); // Open dialog state
    const [rows, setRows] = useState([]); // Rows for DataGrid
    const [openAlert, setOpenAlert] = useState(false); // Open alert state
    
    const formatCampaignData = (data) => {
        return data.map((campaign) => ({
            ...campaign,
            title: campaign.title,
            sts: campaign.status,
            pc: campaign.pc.map((character) => character.characterName).join(", "),
        }));
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const [alert, setAlert] = useState({
        message: "",
        severity: "",
    }); // Alert message and severity (error, success)
    const [campaignData, setCampaign] = useState({
        id: null,
        title: "",
        dm: "",
        description: "",
        status: "",
        startDate: "",
        endDate: "",
        pc: [],
        ql: "",
    }); // Campaign data to be added or edited

    // Fetch the list of classes from the backend
    const fetchCampaigns = async () => {
        try {
            const requests = [
                axios.get("http://localhost:5000/api/v1/campaigns"),
                axios.get("https://campaigns:8001/api/v1/campaigns"),
            ];
            const response = await Promise.any(requests);
            setRows(response.data); // Set the fetched classes to the state
        } catch (error) {
            console.error("Error fetching campaigns", error);
            // Display an alert if there is an error
            setAlert({
                message: "Failed to load campaigns",
                severity: "error",
            });
            setOpenAlert(true); // Open the alert
        }
    };

    // Handle the class actions (add or edit)
    const handleCampaign = ({ action, campaignData }) => {
        console.info("Handle campaign action:", action);
        setAction(action); // Set the current action (add/edit)
        // If adding a class, clear the form fields
        if (action === "add") {
            setCampaign({
                id: null,
                title: "",
                dm: "",
                description: "",
                status: "",
                startDate: "",
                endDate: "",
                pc: [],
                ql: "",
            });
        } else if (action === "edit") {
            //            formatCampaignData(campaignData);
            setCampaign(campaignData); // If editing, load the class data into the form
        } else {
            console.warn("Unknown action:", action);
        }
        setOpenDialog(true); // Open the dialog
    };

    // Delete a class from the database
    const deleteCampaign = async (id) => {
        try {
            const requests = [
                axios.delete(`http://localhost:5000/api/v1/campaigns/${id}`,
                    {
                        'mode': 'no-cors',
	                    'headers': {
                            'Access-Control-Allow-Origin': '*',
                        }
                    }
                ),
                axios.delete(`https://campaigns:8001/api/v1/campaigns/${id}`,
                    {
                        'mode': 'no-cors',
                        'headers': {
                            'Access-Control-Allow-Origin': '*',
                        }
                    }
                )
            ];
            await Promise.any(requests);
            setRows(rows.filter((row) => row._id !== id)); // Remove the deleted class from the table
            setAlert({
                message: "Campaign deleted successfully",
                severity: "success",
            });
        } catch (error) {
        console.error("Error deleting campaign: ", error);
        setAlert({
            message: "Failed to delete campaign",
            severity: "error",
        });
        }
        setOpenAlert(true); // Open the alert with success or error message
    };

    return (
        <Box sx={{ minHeight: '100vh', paddingBottom: '50px' }}> {/* Add a blank space in the bottom */}
        <Container maxWidth="xl" disableGutters>
            {/* Button to add a new class */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 2 }}>
            <Button
                startIcon={<AddCircleIcon />}
                variant="contained"
                sx={{ borderRadius: 3 }}
                onClick={() => handleCampaign({ action: "add" })}
            >
                Create Campaign
            </Button>
            </Box>

            {/* DataGrid table for displaying campaigns */}
            <Paper sx={{ 
                overflow: 'auto', // Enables scrolling if content overflows
                maxHeight: 'calc(100vh - 100px)', // Sets a maximum height based on the viewport height minus 100px
                width: '80%', // Sets the width to 80% of the parent container
                maxWidth: '1200px', // Sets a maximum fixed width for the Paper component
                margin: '0 auto', // Centers the Paper horizontally
            }}>
                <DataGrid
                    columns={columns} // The columns that you already have defined
                    rows={ rows.map((row) => ({
                        ...row,
                        pc: [...new Set(row.pc.map((char) => char.characterName))].join(", "),
                    Campaign: row.title
                    }))
                    } // The rows that you already have defined

                    getRowId={(row) => row._id} // Unique identifier for each row, based on _id
                    autoHeight // Automatically adjusts the row height based on content
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 }, // Default page and page size
                        },
                    }}
                    pageSizeOptions={[5, 10]} // Options for the pagination to choose page sizes
                    components={{
                        ColumnHeader: () => null, // Customizes the column header, here it hides it
                    }}
                    getRowHeight={() => 'auto'} // Allows the row height to be auto-adjusted based on content
                />
            </Paper>
            {/* Dialog for adding or editing a campaign */}
            <CampaignDialog
                open={openDialog}
                setOpen={setOpenDialog}
                campaignData={campaignData}
                setCampaign={setCampaign}
                action={action}
                rows={rows}
                setRows={setRows}
                setAlert={setAlert}
                setOpenAlert={setOpenAlert}
            />

            {/* Alert component to show error or success messages */}
            <Alerts
                open={openAlert}
                setOpen={setOpenAlert}
                alert={alert}
                setAlert={setAlert}
            />
        </Container>
        </Box>
    );
}