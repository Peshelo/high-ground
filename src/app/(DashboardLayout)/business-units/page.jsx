'use client';
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Paper, TextField,
  InputAdornment, Modal, Grid, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { IconPlus, IconSearch, IconEye } from '@tabler/icons-react';

const apiBaseUrl = 'http://4.222.232.224/api/v1';

export default function ManageBusinessUnitsPage() {
  const [businessUnits, setBusinessUnits] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [newUnit, setNewUnit] = useState({
    name: '',
    code: '',
    description: '',
    parentUnitId: 0,
    headId: 0,
    location: '',
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [unitsRes, usersRes] = await Promise.all([
        fetch(`${apiBaseUrl}/business-units?page=0&size=10&sortBy=id&sortDirection=asc`),
        fetch(`${apiBaseUrl}/users?page=0&size=100&sortBy=id&sortDirection=asc`),
      ]);
      const unitsData = await unitsRes.json();
      const usersData = await usersRes.json();
      setBusinessUnits(unitsData.content || []);
      setUsers(usersData.content || []);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddUnit = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/business-units/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUnit),
      });
      if (response.ok) {
        setOpenAddModal(false);
        setNewUnit({
          name: '',
          code: '',
          description: '',
        //   parentUnitId: 0,
          headId: 0,
          location: '',
        });
        fetchData();
      } else {
        console.error('Failed to add unit');
      }
    } catch (error) {
      console.error('Add unit error', error);
    }
  };

  const handleViewUnit = (unit) => {
    setSelectedUnit(unit);
    setOpenViewModal(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Business Units
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search business units..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size="1rem" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<IconPlus size="1.1rem" />}
            onClick={() => setOpenAddModal(true)}
          >
            Add Business Unit
          </Button>
        </Box>

        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Head</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {businessUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell>{unit.name}</TableCell>
                    <TableCell>{unit.code}</TableCell>
                    <TableCell>{unit.description}</TableCell>
                    <TableCell>{unit.location}</TableCell>
                    <TableCell>{unit.headFullName || '—'}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<IconEye size="1rem" />}
                        onClick={() => handleViewUnit(unit)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add Modal */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Paper sx={{ p: 4, width: 500, mx: 'auto', mt: '5%', position: 'relative' }}>
          <Typography variant="h6" gutterBottom>Add Business Unit</Typography>
          <Grid container spacing={2}>
            {['name', 'code', 'description', 'location'].map((field) => (
              <Grid item xs={12} key={field}>
                <TextField
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  fullWidth
                  value={newUnit[field]}
                  onChange={(e) => setNewUnit({ ...newUnit, [field]: e.target.value })}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Head of Unit</InputLabel>
                <Select
                  value={newUnit.headId}
                  label="Head of Unit"
                  onChange={(e) => setNewUnit({ ...newUnit, headId: e.target.value })}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" onClick={handleAddUnit}>
                Save
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>

      {/* View Modal */}
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <Paper sx={{ p: 4, width: 500, mx: 'auto', mt: '5%' }}>
          <Typography variant="h6" gutterBottom>View Business Unit</Typography>
          {selectedUnit ? (
            <Box>
              <Typography><strong>Name:</strong> {selectedUnit.name}</Typography>
              <Typography><strong>Code:</strong> {selectedUnit.code}</Typography>
              <Typography><strong>Description:</strong> {selectedUnit.description}</Typography>
              <Typography><strong>Location:</strong> {selectedUnit.location}</Typography>
              <Typography><strong>Head:</strong> {selectedUnit.headFullName || '—'}</Typography>
            </Box>
          ) : (
            <Typography>No unit selected</Typography>
          )}
        </Paper>
      </Modal>
    </Box>
  );
}
