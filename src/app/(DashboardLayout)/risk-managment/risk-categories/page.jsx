"use client";
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  Box, 
  Button, 
  Typography, 
  TextField, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { CheckBox } from '@mui/icons-material';

// API Service
const apiBaseUrl = 'http://4.222.232.224/api/v1';

async function fetchCategories() {
  const response = await fetch(`${apiBaseUrl}/risk-categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

async function createCategory(data) {
  const response = await fetch(`${apiBaseUrl}/risk-categories/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': '*/*'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create category');
  return response.json();
}

async function updateCategory(id, data) {
  const response = await fetch(`${apiBaseUrl}/risk-categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'accept': '*/*'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update category');
  return response.json();
}

async function deleteCategory(id) {
  const response = await fetch(`${apiBaseUrl}/risk-categories/${id}`, {
    method: 'DELETE',
    headers: {
      'accept': '*/*'
    }
  });
  if (!response.ok) throw new Error('Failed to delete category');
  return response.ok;
}

const RiskCategoriesPage = () => {
  const theme = useTheme();
  const [categories, setCategories] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentCategory, setCurrentCategory] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Pagination state
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Form state
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    code: '',
    active: true
  });

  // Form errors
  const [errors, setErrors] = React.useState({
    name: false,
    code: false
  });

  // Load categories on mount
  React.useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCategories();
      setCategories(data.content || []);
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.message, 
        severity: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      description: '',
      code: '',
      active: true
    });
    setIsEditing(false);
    setCurrentCategory(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description,
      code: category.code,
      active: category.active
    });
    setIsEditing(true);
    setCurrentCategory(category);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrors({
      name: false,
      code: false
    });
  };

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is filled
    if (errors[field] && value) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.name) { 
      newErrors.name = true; 
      valid = false; 
    }
    
    if (!formData.code) { 
      newErrors.code = true; 
      valid = false; 
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({ 
        open: true, 
        message: 'Please fill all required fields', 
        severity: 'error' 
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (isEditing && currentCategory) {
        await updateCategory(currentCategory.id, formData);
        setSnackbar({ 
          open: true, 
          message: 'Category updated successfully', 
          severity: 'success' 
        });
      } else {
        await createCategory(formData);
        setSnackbar({ 
          open: true, 
          message: 'Category created successfully', 
          severity: 'success' 
        });
      }
      
      await loadCategories();
      handleCloseDialog();
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.message, 
        severity: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await deleteCategory(id);
      setSnackbar({ 
        open: true, 
        message: 'Category deleted successfully', 
        severity: 'success' 
      });
      await loadCategories();
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.message, 
        severity: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Risk Categories</Typography>
        <Button
          variant="contained"
          startIcon={<IconPlus size="1.1rem" />}
          onClick={handleOpenCreate}
        >
          Add Category
        </Button>
      </Stack>

      <Paper elevation={3} sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Risks Count</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.code}</TableCell>
                    <TableCell>
                      {category.description || '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={category.active ? 'Active' : 'Inactive'}
                        color={category.active ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{category.risksCount}</TableCell>
                    <TableCell>
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton 
                          onClick={() => handleOpenEdit(category)}
                          color="primary"
                        >
                          <IconEdit size="1.1rem" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          onClick={() => handleDelete(category.id)}
                          color="error"
                        >
                          <IconTrash size="1.1rem" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={categories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Risk Category' : 'Add New Risk Category'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name *"
              value={formData.name}
              onChange={handleChange('name')}
              error={errors.name}
              helperText={errors.name ? 'Name is required' : ''}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Code *"
              value={formData.code}
              onChange={handleChange('code')}
              error={errors.code}
              helperText={errors.code ? 'Code is required' : ''}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <CheckBox
                  checked={formData.active}
                  onChange={handleChange('active')}
                  color="primary"
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog}
            startIcon={<IconX size="1.1rem" />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<IconCheck size="1.1rem" />}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
};

export default RiskCategoriesPage;