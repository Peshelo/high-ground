"use client";
import * as React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react';
import ControlForm from '@/app/components/risk-managment/ControlForm';

export default function CreateControlPage() {
  const router = useRouter();
  const [users, setUsers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const apiBaseUrl = 'http://4.222.232.224/api/v1';

async function fetchData(endpoint) {
  const response = await fetch(`${apiBaseUrl}${endpoint}`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}

async function postData(endpoint, data) {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': '*/*'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}

async function putData(endpoint, data) {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'accept': '*/*'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}

async function deleteData(endpoint) {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'accept': '*/*'
    }
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}
  const [controlData, setControlData] = React.useState({
    name: '',
    description: '',
    controlType: 'PREVENTIVE',
    controlNature: 'MANUAL',
    status: 'PLANNED',
    effectiveness: 50,
    ongoingCost: 0,
    implementationDate: new Date().toISOString().split('T')[0],
    targetCompletionDate: new Date().toISOString().split('T')[0],
    reviewFrequency: 1,
    operatingProcedure: '',
    testingProcedure: '',
    automated: false,
    limitations: '',
    dependencies: '',
    ownerId: 0
  });

  React.useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchData('/users');
        setUsers(usersData.content || []);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };
    
    loadUsers();
  }, []);

  const handleChange = (field, value) => {
    setControlData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!controlData.name) {
      setSnackbar({
        open: true,
        message: 'Control name is required',
        severity: 'error'
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await postData('/risk-controls/create', controlData);
      
      setSnackbar({
        open: true,
        message: 'Control created successfully',
        severity: 'success'
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/risk-management/controls');
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to create control: ' + error.message,
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Create New Control</Typography>
        
        <Button
          variant="outlined"
          startIcon={<IconArrowLeft size="1.1rem" />}
          onClick={() => router.push('/risk-management/controls')}
        >
          Back to Controls
        </Button>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <ControlForm 
          controlData={controlData} 
          onChange={handleChange}
          users={users}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<IconDeviceFloppy size="1.1rem" />}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Control'}
          </Button>
        </Box>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}