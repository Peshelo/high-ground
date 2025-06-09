import * as React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import { IconDotsVertical, IconFilter, IconRefresh, IconSearch, IconTrash, IconFileExport, IconFileImport, IconPlus, IconEye } from '@tabler/icons-react';
import CustomCheckbox from '../../../forms/theme-elements/CustomCheckbox';
import CustomSwitch from '../../../forms/theme-elements/CustomSwitch';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'riskId',
    numeric: false,
    disablePadding: false,
    label: 'Risk ID',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'Type',
  },
  {
    id: 'title',
    numeric: false,
    disablePadding: false,
    label: 'Title',
  },
  {
    id: 'categoryName',
    numeric: false,
    disablePadding: false,
    label: 'Category',
  },
  {
    id: 'ownerFullName',
    numeric: false,
    disablePadding: false,
    label: 'Owner',
  },
  {
    id: 'inherentRiskScore',
    numeric: true,
    disablePadding: false,
    label: 'Inherent Score',
  },
  {
    id: 'residualRiskScore',
    numeric: true,
    disablePadding: false,
    label: 'Residual Score',
  },
  {
    id: 'priority',
    numeric: false,
    disablePadding: false,
    label: 'Priority',
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Actions',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <CustomCheckbox
            color="primary"
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all risks',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const EnhancedTableToolbar = (props) => {
  const { numSelected, handleSearch, search, handleRefresh, handleExport, handleImport, handleCreateNew } = props;
  const theme = useTheme();

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        display: 'flex',
        justifyContent: 'space-between',
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ flex: '1 1 100%', display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size="1.1rem" />
                </InputAdornment>
              ),
            }}
            placeholder="Search risks..."
            size="small"
            onChange={handleSearch}
            value={search}
            sx={{ width: 300 }}
          />
          <Tooltip title="Filter">
            <IconButton>
              <IconFilter size="1.2rem" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh}>
              <IconRefresh size="1.2rem" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 1 }}>
        {numSelected > 0 ? (
          <>
            <Tooltip title="Delete">
              <IconButton>
                <IconTrash width="18" />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<IconPlus size="1.1rem" />}
              onClick={handleCreateNew}
            >
              Create
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<IconFileImport size="1.1rem" />}
              onClick={handleImport}
            >
              Import
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<IconFileExport size="1.1rem" />}
              onClick={handleExport}
            >
              Export
            </Button>
          </>
        )}
      </Box>
    </Toolbar>
  );
};

const RiskViewPage = () => {
  const navigate = useRouter();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('riskId');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState('');
  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [totalElements, setTotalElements] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  // Fetch risks from API
  const fetchRisks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://4.222.232.224/api/v1/risks`, {
        params: {
          page: page,
          size: rowsPerPage,
          sortBy: orderBy,
          sortDirection: order
        }
      });
      setRows(response.data.content);
      setFilteredRows(response.data.content);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching risks:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRisks();
  }, [page, rowsPerPage, order, orderBy]);

  // Handle search
  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearch(searchValue);
    
    const filtered = rows.filter((row) => {
      return (
        (row.riskId && row.riskId.toLowerCase().includes(searchValue)) ||
        (row.status && row.status.toLowerCase().includes(searchValue)) ||
        (row.type && row.type.toLowerCase().includes(searchValue)) ||
        (row.title && row.title.toLowerCase().includes(searchValue)) ||
        (row.categoryName && row.categoryName.toLowerCase().includes(searchValue)) ||
        (row.ownerFullName && row.ownerFullName.toLowerCase().includes(searchValue))
      );
    });
    
    setFilteredRows(filtered);
    setPage(0);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchRisks();
    setSearch('');
    setSelected([]);
  };

  // Handle export
  const handleExport = () => {
    alert('Export functionality would be implemented here');
  };

  // Handle import
  const handleImport = () => {
    alert('Import functionality would be implemented here');
  };

  // Handle create new risk
  const handleCreateNew = async () => {
    try {
      const response = await axios.post(
        'http://4.222.232.224/api/v1/risks/create/draft',
        {},
        {
          headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.riskId) {
        navigate.push(`/risk-managment/create-risk/${response.data.riskId}`);
      } else {
        console.error('Failed to create draft: No riskId in response');
        alert('Failed to create draft risk. Please try again.');
      }
    } catch (error) {
      console.error('Error creating draft risk:', error);
      alert('Error creating draft risk. Please try again.');
    }
  };

  // Sorting
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Select all rows
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredRows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // Select single row
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  // Get color based on risk priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'error';
      case 'CRITICAL': return 'error';
      case 'NONE': return 'default';
      default: return 'default';
    }
  };

  // Get color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT': return 'default';
      case 'UNDER_REVIEW': return 'info';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'MITIGATED': return 'secondary';
      default: return 'default';
    }
  };

  // Format risk type
  const formatRiskType = (type) => {
    if (!type) return '';
    return type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ');
  };

  return (
    <Box>
      <EnhancedTableToolbar
        numSelected={selected.length}
        search={search}
        handleSearch={handleSearch}
        handleRefresh={handleRefresh}
        handleExport={handleExport}
        handleImport={handleImport}
        handleCreateNew={handleCreateNew}
      />
      
      <Paper variant="outlined" sx={{ mx: 2, mt: 1, border: `1px solid ${borderColor}` }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 1200 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredRows.length}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={headCells.length + 1} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headCells.length + 1} align="center">
                    No risks found
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {stableSort(filteredRows, getComparator(order, orderBy))
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <CustomCheckbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Typography fontWeight={600}>{row.riskId}</Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Chip 
                              label={formatRiskType(row.status)} 
                              size="small" 
                              color={getStatusColor(row.status)}
                            />
                          </TableCell>
                          
                          <TableCell>
                            <Typography>{formatRiskType(row.type)}</Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Typography>{row.title}</Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Typography>{row.categoryName}</Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Typography>{row.ownerFullName}</Typography>
                            </Box>
                          </TableCell>
                          
                          <TableCell align="right">
                            <Typography>{row.inherentRiskScore}</Typography>
                          </TableCell>
                          
                          <TableCell align="right">
                            <Typography>{row.residualRiskScore}</Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Chip 
                              label={formatRiskType(row.priority)} 
                              size="small" 
                              color={getPriorityColor(row.priority)}
                            />
                          </TableCell>
                          
                          <TableCell>
                            <Box display="flex" justifyContent="center" alignItems="center">
                              <Tooltip title="View Details">
                                {row.status == 'DRAFT' ? 
                                  <IconButton size="small" onClick={() => navigate.push(`/risk-managment/create-risk/${row.riskId}`)}>
                                    <IconEye size="1.1rem" />
                                  </IconButton>
                                :
                                <IconButton size="small" onClick={() => navigate.push(`/risk-managment/risk/${row.riskId}`)}>
                                  <IconEye size="1.1rem" />
                                </IconButton>
                                }

                                
                              </Tooltip>

                            <Tooltip title="Actions">
                              <IconButton size="small">
                                <IconDotsVertical size="1.1rem" />
                              </IconButton>
                            </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={headCells.length + 1} />
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      <Box ml={2} mt={1}>
        <FormControlLabel
          control={<CustomSwitch checked={dense} onChange={handleChangeDense} />}
          label="Compact view"
        />
      </Box>
    </Box>
  );
};

export default RiskViewPage;