import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Collapse } from "@mui/material";

const CreateRoomPage = ({
  defaultUpdate = false,
  defaultVotes = 2,
  defaultGuestCanPause = true,
  defaultRoomCode = null,
  defaultUpdateCallback = null,
}) => {
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
  const [guestCanPause, setGuestCanPause] = useState(defaultGuestCanPause);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleVotesChange = (event) => {
    setVotesToSkip(parseInt(event.target.value)); // Ensure numeric value
  };

  const handleGuestCanPauseChange = (event) => {
    setGuestCanPause(event.target.value === "true");
  };

  const handleRoomCreate = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };

    try {
      const response = await fetch("/api/create-room", requestOptions);
      const data = await response.json();
      navigate("/room/" + data.code);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  // use settimer for 1 second to clear the message
  const showMessage = () => {
    setMessage("Room updated successfully!");
    setTimeout(() => {
      setMessage("");
    }, 1000);
  };

  const handleRoomUpdate = async () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: defaultRoomCode,
      }),
    };

    try {
      await fetch("/api/update-room", requestOptions);
      if (defaultUpdateCallback) {
        showMessage();
        defaultUpdateCallback();
      }
    } catch (error) {
      setMessage("Error updating room...");
      console.error("Error updating room:", error);
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          {defaultUpdate ? "Update Room" : "Create a Room"}
        </Typography>
      </Grid>
      {defaultUpdate ? (
        <Grid item xs={12} align="center">
          <Collapse in={message !== ""}>
            <Typography color="secondary" variant="h6">
              {message}
            </Typography>
          </Collapse>
        </Grid>
      ) : null}
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={guestCanPause}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required
            type="number"
            defaultValue={defaultVotes}
            inputProps={{ min: 1, style: { textAlign: "center" } }}
            onChange={handleVotesChange}
          />
          <FormHelperText>
            <div align="center">Votes Required to Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={defaultUpdate ? handleRoomUpdate : handleRoomCreate}
        >
          {defaultUpdate ? "Update" : "Create"}
        </Button>
      </Grid>
      {!defaultUpdate ? (
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      ) : null}
    </Grid>
  );
};

export default CreateRoomPage;
