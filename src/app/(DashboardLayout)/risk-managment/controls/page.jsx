"use client";
import * as React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  TextField,
  InputAdornment
} from '@mui/material';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import ControlsList from '@/app/components/risk-managment/ControlsList';

export default function ControlsPage() {
  const router = useRouter();
  const [controls, setControls] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [selectedControls, setSelectedControls] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isLoading, setIsLoading] = React.useState(true);
const apiBaseUrl = 'http://4.222.232.224/api/v1';

async function fetchData(endpoint) {
  const response = await fetch(`${apiBaseUrl}${endpoint}`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}


  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [controlsData, usersData] = await Promise.all([
          fetchData('/risk-controls'),
          fetchData('/users')
        ]);
        
        setControls(controlsData.content || []);
        setUsers(usersData.content || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleSelectControl = (controlId) => {
    setSelectedControls(prev => {
      const newSelected = [...prev];
      const index = newSelected.indexOf(controlId);
      
      if (index === -1) {
        newSelected.push(controlId);
      } else {
        newSelected.splice(index, 1);
      }
      
      return newSelected;
    });
  };

  const handleSelectAllControls = (event) => {
    if (event.target.checked) {
      setSelectedControls(controls.map(control => control.id));
    } else {
      setSelectedControls([]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Risk Controls
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <TextField
            size="small"
            placeholder="Search controls..."
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
            onClick={() => router.push('/risk-managment/controls/create')}
          >
            Add Control
          </Button>
        </Box>
        
        <ControlsList
          controls={controls}
          selectedControls={selectedControls}
          onSelectControl={handleSelectControl}
          onSelectAllControls={handleSelectAllControls}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          users={users}
        />
      </Paper>
    </Box>
  );
}