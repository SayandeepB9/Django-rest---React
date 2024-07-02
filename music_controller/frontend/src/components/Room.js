import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Fade, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import CreateRoomPage from "./CreateRoomPage";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";

export default function Room() {
  const { roomCode } = useParams(); // Accessing the room code from the URL
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false); // [1]
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
  });

  useEffect(() => {
    getRoomDetails();
  }, []); // Empty dependency array means this effect will run once, similar to componentDidMount

  // check whether response is empty or not
  const getRoomDetails = async () => {
    // Make the function async
    try {
      const response = await fetch(`/api/get-room?code=${roomCode}`);

      if (!response.ok) {
        // Handle unsuccessful response (e.g., redirect)
        navigate("/");
        return; // Exit early to avoid further processing
      }

      const data = await response.json();
      setState({
        votesToSkip: data.votes_to_skip,
        guestCanPause: data.guest_can_pause,
        isHost: data.is_host,
      });
      setShowSettings(false);
      setIsLoading(false);
    } catch (error) {
      // Catch any errors within the try block
      console.error("Error fetching room details:", error);
    }
  };

  const handleLeaveRoom = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    const leaveRoom = await fetch("/api/leave-room", requestOptions);
    if (leaveRoom.ok) {
      navigate("/");
    } else {
      // Handle error, e.g., show an error message
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <CircularProgress />
      </div>
    );
  }


  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Room: {roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Votes: {state.votesToSkip}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Guest Can Pause: {state.guestCanPause ? "Yes" : "No"}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Host: {state.isHost ? "Yes" : "No"}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLeaveRoom}
          >
            Leave Room
          </Button>
        </Grid>
        {state.isHost ? (
          <Grid
            item
            xs={12}
            align="center"
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowSettings(true)}
            >
              Settings
              <SettingsIcon />
            </Button>
            {showSettings ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setShowSettings(false)}
              >
                <CloseIcon />
              </Button>
            ) : null}
          </Grid>
        ) : null}
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            <Fade in={showSettings} timeout={1000}>
              <Box minHeight="100vh">
                <CreateRoomPage
                  defaultUpdate={true}
                  defaultVotes={state.votesToSkip}
                  defaultGuestCanPause={state.guestCanPause}
                  defaultRoomCode={roomCode}
                  defaultUpdateCallback={getRoomDetails}
                />
              </Box>
            </Fade>
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
