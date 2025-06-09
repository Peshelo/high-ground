"use client";
import * as React from 'react';
import { 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Slider, 
  Typography,
  Box,
  InputAdornment,
  Checkbox,
  FormControlLabel
} from '@mui/material';

const ControlForm = ({ 
  controlData, 
  onChange, 
  users,
  isEdit = false 
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Control Name"
          value={controlData.name}
          onChange={(e) => onChange('name', e.target.value)}
          required
        />
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          value={controlData.description}
          onChange={(e) => onChange('description', e.target.value)}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Control Type</InputLabel>
          <Select
            value={controlData.controlType}
            label="Control Type"
            onChange={(e) => onChange('controlType', e.target.value)}
          >
            <MenuItem value="PREVENTIVE">Preventive</MenuItem>
            <MenuItem value="DETECTIVE">Detective</MenuItem>
            <MenuItem value="CORRECTIVE">Corrective</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Control Nature</InputLabel>
          <Select
            value={controlData.controlNature}
            label="Control Nature"
            onChange={(e) => onChange('controlNature', e.target.value)}
          >
            <MenuItem value="MANUAL">Manual</MenuItem>
            <MenuItem value="AUTOMATED">Automated</MenuItem>
            <MenuItem value="IT_DEPENDENT">IT Dependent</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="body2" gutterBottom>
          Effectiveness: {controlData.effectiveness}%
        </Typography>
        <Slider
          value={controlData.effectiveness}
          onChange={(e, value) => onChange('effectiveness', value)}
          min={1}
          max={100}
          valueLabelDisplay="auto"
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="Implementation Date"
          InputLabelProps={{ shrink: true }}
          value={controlData.implementationDate}
          onChange={(e) => onChange('implementationDate', e.target.value)}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="Target Completion Date"
          InputLabelProps={{ shrink: true }}
          value={controlData.targetCompletionDate}
          onChange={(e) => onChange('targetCompletionDate', e.target.value)}
        />
      </Grid>
      
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Owner</InputLabel>
          <Select
            value={controlData.ownerId}
            label="Owner"
            onChange={(e) => onChange('ownerId', e.target.value)}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox 
              checked={controlData.automated}
              onChange={(e) => onChange('automated', e.target.checked)}
            />
          }
          label="Automated Control"
        />
      </Grid>
    </Grid>
  );
};

export default ControlForm;