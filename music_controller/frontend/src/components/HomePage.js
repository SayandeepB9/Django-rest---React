import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Grid, ButtonGroup, Button, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const HomePage = () => {
  const [roomCode, setRoomCode] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchRoomCode = async () => {
      try {
        const response = await fetch("/api/user-in-room");
        if (!response.ok) {
          throw new Error("Failed to fetch room code");
        }
        const data = await response.json();
        setRoomCode(data.code);
      } catch (error) {
        console.error("Error fetching room code:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchRoomCode();
  }, []);

  if (isLoaded && roomCode) {
    return <Navigate to={`/room/${roomCode}`} />;
  }
  else if (!isLoaded) {
    return (
      <div className="center">
        <CircularProgress />
      </div>
    );
  }
  return <WelcomeComponent />;
};

const WelcomeComponent = () => {
  const navigate = useNavigate();
  return (
    <div className="center">
    <Grid container spacing={3}>
      <Grid item xs={12} align="center">
        <Typography variant="h3" compact="h3">
          House Party
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <ButtonGroup disableElevation variant="contained" color="primary">
          <Button color="primary" onClick={() => navigate("/join")}>
            Join a Room
          </Button>
          <Button color="secondary" onClick={() => navigate("/create")}>
            Create a Room
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
    </div>
  );
};

export default HomePage;
