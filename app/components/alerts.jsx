import { Alert, Snackbar } from "@mui/material";

// This component shows an alert message
export default function Alerts({ open, setOpen, alert, setAlert }) {
  
  // Function to close the alert
  const handleClose = () => {
    setOpen(false); // Close the alert
  };

  return (
    <Snackbar
      open={open} // Show or hide the alert
      autoHideDuration={3000} // The alert will disappear after 3 seconds
      onClose={handleClose} // Close the alert when needed
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Position the alert at the bottom center of the screen
    >
      <Alert onClose={handleClose} severity={alert.severity} variant="filled">
        {alert.message} {/* Show the alert message */}
      </Alert>
    </Snackbar>
  );
}
