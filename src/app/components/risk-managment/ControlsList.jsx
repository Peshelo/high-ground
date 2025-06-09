"use client";
import * as React from 'react';
import { 
  Box, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  LinearProgress,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Link,
  Popover
} from '@mui/material';
import { 
  IconEdit, 
  IconTrash,
  IconEye
} from '@tabler/icons-react';

const ControlsList = ({ 
  controls, 
  selectedControls, 
  onSelectControl,
  onSelectAllControls,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  users
}) => {
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [selectedControl, setSelectedControl] = React.useState(null);

  const handleViewControl = (control) => {
    setSelectedControl(control);
    setOpenViewModal(true);
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedControls.length > 0 &&
                    selectedControls.length < controls.length
                  }
                  checked={
                    controls.length > 0 &&
                    selectedControls.length === controls.length
                  }
                  onChange={onSelectAllControls}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Nature</TableCell>
              <TableCell>Associated Risk</TableCell>

              <TableCell>Effectiveness</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {controls
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((control) => (
                <TableRow key={control.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedControls.includes(control.id)}
                      onChange={() => onSelectControl(control.id)}
                    />
                  </TableCell>
                  <TableCell>{control.name}</TableCell>
                  <TableCell>
                    <Chip label={control.controlType} size="small" />
                  </TableCell>
                  <TableCell>{control.controlNature}</TableCell>
                  <TableCell><Link href={`/risk-managment/risk/${control.riskId}`} underline="hover">
                    {control.riskId || 'Unassigned'}
                  </Link></TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={control.effectiveness} 
                          color={
                            control.effectiveness >= 80 ? 'success' :
                            control.effectiveness >= 50 ? 'warning' : 'error'
                          }
                        />
                      </Box>
                      <Typography variant="body2">{control.effectiveness}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {users.find(u => u.id === control.ownerId)?.firstName || 'Unassigned'}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton onClick={() => handleViewControl(control)}>
                        <IconEye size="1rem" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={controls.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </TableContainer>

      {/* Control Details Modal */}
      <Dialog open={openViewModal} onClose={() => setOpenViewModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Control Details</DialogTitle>
        <DialogContent>
          {selectedControl && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedControl.name}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Description:</strong> {selectedControl.description}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Type:</strong> {selectedControl.controlType}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Nature:</strong> {selectedControl.controlNature}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Effectiveness:</strong> {selectedControl.effectiveness}%
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Owner:</strong> {users.find(u => u.id === selectedControl.ownerId)?.firstName || 'Unassigned'}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Implementation Date:</strong> {new Date(selectedControl.implementationDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Review Frequency:</strong> Every {selectedControl.reviewFrequency} months
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ControlsList;