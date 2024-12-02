"use client";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  MenuItem,
  Slider,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { useState, useEffect } from "react";

export default function BossDialog({
  open,
  setOpen,
  bossData,
  setBossData,
  action,
  rows,
  setRows,
  setAlert,
  setOpenAlert,
}) {
  const defaultBossData = {
    name: "",
    type: "",
    cr: 0,
    ac: 10,
    hp: 0,
    resistances: [],
    immunities: [],
    abilities: "",
  };

  const [localBossData, setLocalBossData] = useState(bossData || defaultBossData);
  const [acError, setAcError] = useState(false);
  const [acHelperText, setAcHelperText] = useState("");
  const [crError, setCrError] = useState(false);
  const [crHelperText, setCrHelperText] = useState("");

  const resistances = ["Fire", "Cold", "Lightning", "Acid", "Poison", "Psychic"];
  const immunities = [
    "Blinded",
    "Charmed",
    "Deafened",
    "Exhaustion",
    "Frightened",
    "Paralyzed",
    "Petrified",
    "Poisoned",
    "Slashing (non-magical)",
  ];

  const creatureTypes = [
    "Aberration",
    "Beast",
    "Celestial",
    "Construct",
    "Dragon",
    "Elemental",
    "Fey",
    "Fiend",
    "Giant",
    "Humanoid",
    "Monstrosity",
    "Ooze",
    "Plant",
    "Undead",
  ];

  useEffect(() => {
    setLocalBossData(bossData || defaultBossData);
  }, [bossData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "ac") {
      const numericValue = value === "" ? "" : Number(value);
      if (numericValue < 10 || numericValue > 18) {
        setAcError(true);
        setAcHelperText(
          "Remember, the allowed AC range for your boss is 10-18. Be careful, warrior!"
        );
      } else {
        setAcError(false);
        setAcHelperText("");
      }
      setLocalBossData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }

    if (name === "cr") {
      const numericValue = value === "" ? "" : Number(value);
      if (numericValue < 0 || numericValue > 30) {
        setCrError(true);
        setCrHelperText("Remember, the allowed CR range for your boss is 0-30. Be careful, warrior!");
      } else {
        setCrError(false);
        setCrHelperText("");
      }
      setLocalBossData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }

    setLocalBossData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSliderChange = (name, value) => {
    setLocalBossData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "ac" && (value < 10 || value > 18)) {
      setAcError(true);
      setAcHelperText("Remember, the allowed AC range for your boss is 10-18. Be careful, warrior!");
    } else {
      setAcError(false);
      setAcHelperText("");
    }

    if (name === "cr" && (value < 0 || value > 30)) {
      setCrError(true);
      setCrHelperText("Remember, the allowed CR range for your boss is 0-30. Be careful, warrior!");
    } else {
      setCrError(false);
      setCrHelperText("");
    }
  };

  const handleHpCalculation = () => {
    const { hitDice, avgRoll, conModifier } = localBossData;
    if (hitDice && avgRoll && conModifier) {
      const calculatedHp = hitDice * avgRoll + conModifier * hitDice;
      setLocalBossData((prev) => ({ ...prev, hp: calculatedHp }));
    }
  };

  const handleSave = () => {
    const processedBossData = {
      ...localBossData, //spread operator
      immunities: localBossData.immunities || [],
    };

    if (action === "add") {
      const newBoss = {
        ...processedBossData,
        _id: rows.length + 1,
      };
      setRows([...rows, newBoss]);
      setAlert({ message: "Boss added successfully", severity: "success" });
    } else if (action === "edit") {
      const updatedRows = rows.map((row) =>
        row._id === processedBossData._id ? processedBossData : row
      );
      setRows(updatedRows);
      setAlert({ message: "Boss updated successfully", severity: "success" });
    }
    setOpen(false);
    setOpenAlert(true);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>{action === "add" ? "Add New Boss" : "Edit Boss"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }} >
          <Typography variant="h6">Basic Information</Typography>
          <TextField
            label="Name"
            name="name"
            value={localBossData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField 
            label="Type"
            name="type"
            value={localBossData.type}
            onChange={handleChange}
            select
            fullWidth
          >
            {creatureTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}

          </TextField>

          <Typography variant="h6">Challenge Rating (CR)</Typography>
          <Slider
            value={localBossData.cr || 0}
            min={0}
            max={30}
            step={1}
            marks={[
              { value: 0, label: "0" },
              { value: 30, label: "30" },
            ]}
            onChange={(e, value) => handleSliderChange("cr", value)}
          />
          <TextField
            label="CR"
            name="cr"
            value={localBossData.cr}
            onChange={handleChange}
            error={crError}
            helperText={crHelperText}
            type="number"
            fullWidth
          />

          <Typography variant="h6">Armor Class (AC)</Typography>
          <Slider
            value={localBossData.ac || 10}
            min={10}
            max={18}
            step={1}
            marks={[
              { value: 10, label: "10" },
              { value: 18, label: "18" },
            ]}
            onChange={(e, value) => handleSliderChange("ac", value)}
          />
          <TextField
            label="AC"
            name="ac"
            value={localBossData.ac}
            onChange={handleChange}
            error={acError}
            helperText={acHelperText || "10: Basic Creature, 18: Adult Dragon"}
            type="number"
            fullWidth
          />

          <Typography variant="h6">HP Calculation</Typography>
          <Box display="flex" gap={5}>
            <TextField
              label="Hit Dice"
              name="hitDice"
              value={localBossData.hitDice || ""}
              onChange={handleChange}
              type="number"
              fullWidth
            />
            <TextField
              label="Average Roll"
              name="avgRoll"
              value={localBossData.avgRoll || ""}
              onChange={handleChange}
              type="number"
              fullWidth
            />
            <TextField
              label="Constitution Modifier"
              name="conModifier"
              value={localBossData.conModifier || ""}
              onChange={handleChange}
              type="number"
              fullWidth
            />
            <Button onClick={handleHpCalculation} fullWidth variant="contained" color="primary">
              CALCULATE HP
            </Button>
          </Box>
          <TextField
            label="HP"
            name="hp"
            value={localBossData.hp}
            onChange={handleChange}
            type="number"
            fullWidth
            disabled
          />

          <Typography variant="h6">Resistances</Typography>
          <FormGroup row>
            {resistances.map((res) => (
              <FormControlLabel
                key={res}
                control={
                  <Checkbox
                    checked={localBossData.resistances?.includes(res) || false}
                    onChange={(e) =>
                      setLocalBossData((prev) => {
                        const updatedResistances = e.target.checked 
                          ? [...(prev.resistances || []), res] //IF YES
                          : prev.resistances.filter((r) => r !== res); //IF NO
                        return { ...prev, resistances: updatedResistances }; 
                      })
                    }
                  />
                }
                label={res}
              />
            ))}
          </FormGroup>

          <Typography variant="h6">Immunities</Typography>
          <FormGroup row>
            {immunities.map((imm) => (
              <FormControlLabel
                key={imm}
                control={
                  <Checkbox
                    checked={localBossData.immunities?.includes(imm) || false}
                    onChange={(e) =>
                      setLocalBossData((prev) => {
                        const updatedImmunities = e.target.checked
                          ? [...(prev.immunities || []), imm] //IF YES
                          : prev.immunities.filter((i) => i !== imm); //IF NO
                        return { ...prev, immunities: updatedImmunities };
                      })
                    }
                  />
                }
                label={imm}
              />
            ))}
          </FormGroup>

          <Typography variant="h6">Abilities</Typography>
          <TextField
            label="Abilities"
            name="abilities"
            value={localBossData.abilities}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
