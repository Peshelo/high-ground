"use client";
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useParams, useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  Typography, 
  TextField, 
  Grid, 
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Slider,
  InputAdornment,
  Tabs,
  Tab,
  LinearProgress,
  ListItemText
} from '@mui/material';
import { 
  IconArrowLeft, 
  IconCheck, 
  IconPlus, 
  IconX,
  IconTrash,
  IconEdit,
  IconSearch,
  IconDeviceFloppy,
  IconArrowRight
} from '@tabler/icons-react';

// API Service
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

const AddRiskForm = () => {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = React.useState(0);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const [isLoading, setIsLoading] = React.useState(false);
  const [riskId, setRiskId] = React.useState(null);
  const [isDraftCreated, setIsDraftCreated] = React.useState(false);
  
  // Data states
  const [riskCategories, setRiskCategories] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [controls, setControls] = React.useState([]);
  const [incidents, setIncidents] = React.useState([]);
  const [businessUnits, setBusinessUnits] = React.useState([]);
  const [incidentStatuses, setIncidentStatuses] = React.useState([]);
  // Modal states
  const [openControlModal, setOpenControlModal] = React.useState(false);
  const [openIncidentModal, setOpenIncidentModal] = React.useState(false);
  
  // New entity states
  const [newControl, setNewControl] = React.useState({
    riskId: params.id,
    name: '',
    description: '',
    controlType: 'PREVENTIVE',
    controlNature: 'MANUAL',
    status:'PLANNED',
    effectiveness: 50,
    ongoingCost:0,
    implementationDate:new Date().toISOString().split('T')[0],
    targetCompletionDate:new Date().toISOString().split('T')[0],
    reviewFrequency: 1,
    operatingProcedure:'',
    testingProcedure:'',
    automated:false,
    limitations:'',
    dependencies:'',
    ownerId: 0
  });
  
  const [newIncident, setNewIncident] = React.useState({
    title: '',
    description: '',
    severity: 'MEDIUM',
    financialLoss: 0,
    reporterId: 0,
    incidentId: `INC-${Math.random().toString(36).substring(2, 15)}`, // To be replaced with actual incident ID logic
    riskId: params.id,
  status: "",
  incidentDate: "",
  detectedDate: "",
  reportedDate: "",
  reporterId: 1,
  assignedToId: 1,
  financialLoss: 0,
  rootCause: "",
  immediateActions: "",
  regulatoryNotificationRequired: true,
  customerImpact: true,
  customerImpactDescription: "",
  affectedBusinessUnitIds: [
  ]
  });
  const primaryRisk =[
  "STRATEGIC_RISK",
  "OPERATIONAL_RISK",
  "PEOPLE_RISK",
  "FINANCIAL_RISK",
  "COMPLIANCE_RISK",
  "TECHNOLOGY_RISK",
  "REPUTATIONAL_RISK",
  "CYBER_SECURITY_RISK",
  "MARKET_RISK",
  "CREDIT_RISK",
  "LIQUIDITY_RISK",
  "DATA_PRIVACY_RISK",
  "LEGAL_RISK",
  "ENVIRONMENTAL_RISK",
  "NONE"
]

  const secondaryRisk = [
  "GORVANANCE_RISK",
  "FINACIAL_REPORTING_RISK",
  "CAPITAL_ADEQUACY_RISK",
  "MARKET_RISK",
  "EARNINGS_RISK",
  "TAXATION_RISK",
  "CLIMATE_RELATED_FINANCIAL_RISK",
  "STRATEGIC_EXECUTION_RISK"
]

tertiaryRisk = [
  "DATA_BREACH",
  "SYSTEM_FAILURE",
  "REGULATORY_NON_COMPLIANCE",
  "SUPPLY_CHAIN_DISRUPTION",
  "MARKET_VOLATILITY",
  "REPUTATIONAL_DAMAGE",
  "OPERATIONAL_RISK",
  "FINANCIAL_RISK",
  "LEGAL_RISK",
  "ENVIRONMENTAL_RISK",
  "CYBER_ATTACK",
  "NONE"
]

  // Form state
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    type: 'OPERATIONAL',
    status: 'DRAFT',
    priority: 'MEDIUM',
    primaryRisk: 'PEOPLE_RISK',
    secondaryRisk: 'GORVANANCE_RISK',
    tertiaryRisk: 'DATA_BREACH',
    version: 1,
    categoryId: 0,
    ownerId: 0,
    stakeholderIds: [],
    inherentProbability: 50,
    inherentImpact: 50,
    potentialFinancialImpact: 0,
    currency: 'USD',
    identifiedDate: new Date().toISOString().split('T')[0],
    reviewDate: '',
    nextAssessmentDate: '',
    controlIds: [],
    incidentIds: [],
    affectedBusinessUnitIds: [],
    rootCause: '',
    consequences: '',
    assumptions: '',
    externalFactors: '',
    regulatoryRequirement: false,
    complianceRelated: false
  });

  // Form errors
  const [errors, setErrors] = React.useState({
    title: false,
    description: false,
    categoryId: false,
    ownerId: false
  });

  // Pagination states
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Create draft on initial load
  React.useEffect(() => {
    const createDraft = async () => {
      try {
        setIsLoading(true);
        setRiskId(params.id);
        setIsDraftCreated(true);
        
        // Load the draft data
        // const riskData = await fetchData(`/risks/${params.id}`);
        // setFormData(prev => ({
        //   ...prev,
        //   status: 'DRAFT',
        //   riskId: riskData.riskId,
        //   identifiedDate: riskData.identifiedDate || new Date().toISOString().split('T')[0],
        //   description: riskData.description || '',
        //   title: riskData.title || '',
        //   type: riskData.type || 'OPERATIONAL',
        //   categoryId: riskData.categoryId || 0,
        //   ownerId: riskData.ownerId || 0,
        //   inherentProbability: riskData.inherentProbability || 50,
        //   inherentImpact: riskData.inherentImpact || 50,
        //   potentialFinancialImpact: riskData.potentialFinancialImpact || 0,
        //   currency: riskData.currency || 'USD',
        //   identifiedDate: riskData.identifiedDate || new Date().toISOString().split('T')[0],
        //   reviewDate: riskData.reviewDate || '',
        //   nextAssessmentDate: riskData.nextAssessmentDate || '',
        //   controlIds: riskData.controlIds || [],
        //   incidentIds: riskData.incidentIds || [],
        //   regulatoryRequirement: riskData.regulatoryRequirement || false,
        //   complianceRelated: riskData.complianceRelated || false,
        //   rootCause: riskData.rootCause || '',
        //   consequences: riskData.consequences || '',
        //   assumptions: riskData.assumptions || '',
        //   externalFactors: riskData.externalFactors || '',
        // }));
        
        // Load other data
        await loadInitialData();
        
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to create draft: ' + error.message, severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!isDraftCreated) {
      createDraft();
    }
  }, [isDraftCreated]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

           const riskData = await fetchData(`/risks/${params.id}`);
        setFormData(prev => ({
          ...prev,
          status: 'DRAFT',
          riskId: riskData.riskId,
          identifiedDate: riskData.identifiedDate || new Date().toISOString().split('T')[0],
          description: riskData.description || '',
          title: riskData.title || '',
          type: riskData.type || 'OPERATIONAL',
          categoryId: riskData.categoryId || 0,
          primaryRisk: riskData.primaryRisk || '',
          secondaryRisk: riskData.secondaryRisk || '',
          tertiaryRisk: riskData.tertiaryRisk || '',
          ownerId: riskData.ownerId || 0,
          inherentProbability: riskData.inherentProbability || 50,
          inherentImpact: riskData.inherentImpact || 50,
          potentialFinancialImpact: riskData.potentialFinancialImpact || 0,
          currency: riskData.currency || 'USD',
          identifiedDate: riskData.identifiedDate || new Date().toISOString().split('T')[0],
          reviewDate: riskData.reviewDate || '',
          nextAssessmentDate: riskData.nextAssessmentDate || '',
          controlIds: riskData.controlIds || [],
          incidentIds: riskData.incidentIds || [],
          regulatoryRequirement: riskData.regulatoryRequirement || false,
          complianceRelated: riskData.complianceRelated || false,
          rootCause: riskData.rootCause || '',
          consequences: riskData.consequences || '',
          assumptions: riskData.assumptions || '',
          externalFactors: riskData.externalFactors || '',
        }));
      
      // Fetch risk categories
      const categories = await fetchData('/risk-categories');
      setRiskCategories(categories.content || []);
      
      // Fetch users
      const usersData = await fetchData('/users');
      setUsers(usersData.content || []);

      // Fetch incident statuses http://4.222.232.224/api/v1/enums/incident-statuses
      const incidentStatusesData = await fetchData('/enums/incident-statuses');
      setIncidentStatuses(incidentStatusesData || []);
      
      // Fetch controls
      const controlsData = await fetchData('/risk-controls');
      setControls(controlsData.content || []);
      
      // Fetch incidents
      const incidentsData = await fetchData('/incidents');
      setIncidents(incidentsData.content || []);
      
      // Fetch business units
      const businessUnitsData = await fetchData('/business-units');
      setBusinessUnits(businessUnitsData.content || []);
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load data: ' + error.message, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate risk rating
  const calculateRiskRating = () => {
    const score = (formData.inherentProbability * formData.inherentImpact) / 100;
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
  };

  // Handle form changes
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is filled
    if (errors[field] && value) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  // Handle control selection
  const handleControlSelect = (controlId) => {
    setFormData(prev => {
      const controlIds = [...prev.controlIds];
      const index = controlIds.indexOf(controlId);
      
      if (index === -1) {
        controlIds.push(controlId);
      } else {
        controlIds.splice(index, 1);
      }
      
      return { ...prev, controlIds };
    });
  };

  // Handle incident selection
  const handleIncidentSelect = (incidentId) => {
    setFormData(prev => {
      const incidentIds = [...prev.incidentIds];
      const index = incidentIds.indexOf(incidentId);
      
      if (index === -1) {
        incidentIds.push(incidentId);
      } else {
        incidentIds.splice(index, 1);
      }
      
      return { ...prev, incidentIds };
    });
  };

  // Handle business unit selection
  const handleBusinessUnitSelect = (unitId) => {
    setFormData(prev => {
      const affectedBusinessUnitIds = [...prev.affectedBusinessUnitIds];
      const index = affectedBusinessUnitIds.indexOf(unitId);
      
      if (index === -1) {
        affectedBusinessUnitIds.push(unitId);
      } else {
        affectedBusinessUnitIds.splice(index, 1);
      }
      
      return { ...prev, affectedBusinessUnitIds };
    });
  };

  // Add new control
  const handleAddControl = async () => {
    try {
      setIsLoading(true);
      const createdControl = await postData('/risk-controls/create', newControl);
      setControls(prev => [...prev, createdControl]);
      setFormData(prev => ({
        ...prev,
        controlIds: [...prev.controlIds, createdControl.id]
      }));
      setOpenControlModal(false);
      setNewControl({
        name: '',
        description: '',
        controlType: 'PREVENTIVE',
        controlNature: 'MANUAL',
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
      setSnackbar({ open: true, message: 'Control added successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to add control: ' + error.message, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Add new incident
  const handleAddIncident = async () => {
    try {
      setIsLoading(true);
      const createdIncident = await postData('/incidents/create', newIncident);
      setIncidents(prev => [...prev, createdIncident]);
      setFormData(prev => ({
        ...prev,
        incidentIds: [...prev.incidentIds, createdIncident.id]
      }));
      setOpenIncidentModal(false);
      // Reset new incident form
      setNewIncident({
        title: '',
        description: '',
        severity: 'MEDIUM',
        financialLoss: 0,
        reporterId: 0,
        incidentId: '', 
        riskId: params.id,
        status: "",
        incidentDate: new Date().toISOString().split('T')[0],
        detectedDate: new Date().toISOString().split('T')[0],
        reportedDate: new Date().toISOString().split('T')[0],
        reporterId: null,
        assignedToId: null,
        financialLoss: 0,
        rootCause: "",
        immediateActions: "",
        regulatoryNotificationRequired: true,
        customerImpact: true,
        customerImpactDescription: "",
        affectedBusinessUnitIds: []
      });
      setSnackbar({ open: true, message: 'Incident added successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to add incident: ' + error.message, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Validate form
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.title) { newErrors.title = true; valid = false; }
    if (!formData.description) { newErrors.description = true; valid = false; }
    if (!formData.categoryId) { newErrors.categoryId = true; valid = false; }
    if (!formData.ownerId) { newErrors.ownerId = true; valid = false; }
    
    setErrors(newErrors);
    return valid;
  };
const handleNextTab = () => {
    if (activeTab < 4) {
      setActiveTab(prev => prev + 1);
    } else {
      setSnackbar({ open: true, message: 'You are already on the last tab', severity: 'info' });
    }
  };
  const handlePreviousTab = () => {
    if (activeTab > 0) {
      setActiveTab(prev => prev - 1);
    } else {
      setSnackbar({ open: true, message: 'You are already on the first tab', severity: 'info' });
    }
  };
  // Save as draft
  const handleSaveDraft = async () => {
    try {
      setIsLoading(true);
      // get risk by id
      const riskData = await fetchData(`/risks/${riskId}`);

      await putData(`/risks/update`, {
        ...formData,
        status: 'DRAFT'
      });
      setSnackbar({ open: true, message: 'Draft saved successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save draft: ' + error.message, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit risk
  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }
    
    try {
      setIsLoading(true);
      await putData(`/risks/update`, {
        ...formData,
        status: 'IDENTIFIED'
      });
      setSnackbar({ open: true, message: 'Risk submitted successfully', severity: 'success' });
      router.push('/risk-managment');
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to submit risk: ' + error.message, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
       
           <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, mb:5 }}>
     <Typography variant="h5" gutterBottom>
          {formData.riskId ? `Risk: ${formData.riskId}` : 'Create New Risk'}
        </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveDraft}
              startIcon={<IconDeviceFloppy size="1.1rem" />}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Draft'}
            </Button>
            
            <Button
              variant="contained"
              onClick={handleSubmit}
              startIcon={<IconCheck size="1.1rem" />}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Risk'}
            </Button>
          </Box>
        </Box>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ mb: 3 }}
        >
          <Tab label="Basic Information" />
          <Tab label="Risk Assessment" />
          <Tab label="Associated Controls" />
          <Tab label="Related Incidents" />
          <Tab label="Affected Units" />
        </Tabs>
        
        {/* Basic Information */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Risk Title *"
                value={formData.title}
                onChange={handleChange('title')}
                error={errors.title}
                helperText={errors.title ? 'Title is required' : ''}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={errors.categoryId}>
                <InputLabel>Category *</InputLabel>
                <Select
                  value={formData.categoryId}
                  label="Category *"
                  onChange={handleChange('categoryId')}
                >
                  {riskCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categoryId && <Typography variant="caption" color="error">Category is required</Typography>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={handleChange('type')}
                >
                  <MenuItem value="STRATEGIC">Strategic</MenuItem>
                  <MenuItem value="OPERATIONAL">Operational</MenuItem>
                  <MenuItem value="FINANCIAL">Financial</MenuItem>
                  <MenuItem value="COMPLIANCE">Compliance</MenuItem>
                  <MenuItem value="TECHNOLOGY">Technology</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={handleChange('priority')}
                >
                  <MenuItem value="CRITICAL">Critical</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
             <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Primary Risk</InputLabel>
                <Select
                  value={formData.primaryRisk}
                  label="Primary Risk"
                  onChange={handleChange('primaryRisk')}
                >
                 {
                  primaryRisk.map((risk) => (
                    <MenuItem key={risk} value={risk}>
                      {risk.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                    </MenuItem>
                  ))
                 }
                </Select>
              </FormControl>
            </Grid>
             <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Secondary Risk</InputLabel>
                <Select
                  value={formData.secondaryRisk}
                  label="Secondary Risk"
                  onChange={handleChange('secondaryRisk')}
                >
                  {
                    secondaryRisk.map((risk) => (
                      <MenuItem key={risk} value={risk}>
                        {risk.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                      </MenuItem>
                    ))

                  }
                </Select>
              </FormControl>
            </Grid>
             <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tertiary Risk</InputLabel>
                <Select
                  value={formData.tertiaryRisk}
                  label="Tertiary Risk"
                  onChange={handleChange('tertiaryRisk')}
                >
               {
                  tertiaryRisk.map((risk) => (
                    <MenuItem key={risk} value={risk}>
                      {risk.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                    </MenuItem>
                  ))
               }
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={errors.ownerId}>
                <InputLabel>Owner *</InputLabel>
                <Select
                  value={formData.ownerId}
                  label="Owner *"
                  onChange={handleChange('ownerId')}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </Avatar>
                        {user.firstName} {user.lastName} ({user.jobTitle})
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.ownerId && <Typography variant="caption" color="error">Owner is required</Typography>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Identified Date"
                InputLabelProps={{ shrink: true }}
                value={formData.identifiedDate}
                onChange={handleChange('identifiedDate')}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description *"
                value={formData.description}
                onChange={handleChange('description')}
                error={errors.description}
                helperText={errors.description ? 'Description is required' : ''}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={formData.regulatoryRequirement}
                      onChange={handleChange('regulatoryRequirement')}
                    />
                  }
                  label="Regulatory Requirement"
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={formData.complianceRelated}
                      onChange={handleChange('complianceRelated')}
                    />
                  }
                  label="Compliance Related"
                />
              </FormGroup>
            </Grid>
          </Grid>
        )}
        
        {/* Risk Assessment */}
        {activeTab === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Risk Assessment
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Inherent Risk Assessment
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Probability (1-100): {formData.inherentProbability}
                </Typography>
                <Slider
                  value={formData.inherentProbability}
                  onChange={handleChange('inherentProbability')}
                  min={1}
                  max={100}
                  valueLabelDisplay="auto"
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Impact (1-100): {formData.inherentImpact}
                </Typography>
                <Slider
                  value={formData.inherentImpact}
                  onChange={handleChange('inherentImpact')}
                  min={1}
                  max={100}
                  valueLabelDisplay="auto"
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Risk Rating:</Typography>
                <Chip
                  label={calculateRiskRating()}
                  color={
                    calculateRiskRating() === 'CRITICAL' ? 'error' :
                    calculateRiskRating() === 'HIGH' ? 'warning' :
                    calculateRiskRating() === 'MEDIUM' ? 'info' : 'success'
                  }
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Financial Impact
              </Typography>
              
              <TextField
                fullWidth
                type="number"
                label="Potential Financial Impact"
                value={formData.potentialFinancialImpact}
                onChange={handleChange('potentialFinancialImpact')}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.currency}
                  label="Currency"
                  onChange={handleChange('currency')}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                  <MenuItem value="ZAR">ZAR</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                type="date"
                label="Next Assessment Date"
                InputLabelProps={{ shrink: true }}
                value={formData.nextAssessmentDate}
                onChange={handleChange('nextAssessmentDate')}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Root Cause"
                value={formData.rootCause}
                onChange={handleChange('rootCause')}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Consequences"
                value={formData.consequences}
                onChange={handleChange('consequences')}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Assumptions"
                value={formData.assumptions}
                onChange={handleChange('assumptions')}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="External Factors"
                value={formData.externalFactors}
                onChange={handleChange('externalFactors')}
              />
            </Grid>
          </Grid>
        )}
        
        {/* Associated Controls */}
        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Associated Controls
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
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
                  variant="outlined"
                  startIcon={<IconPlus size="1rem" />}
                  onClick={() => setOpenControlModal(true)}
                >
                  Add New Control
                </Button>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            formData.controlIds.length > 0 &&
                            formData.controlIds.length < controls.length
                          }
                          checked={
                            controls.length > 0 &&
                            formData.controlIds.length === controls.length
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                controlIds: controls.map(control => control.id)
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                controlIds: []
                              }));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Nature</TableCell>
                      <TableCell>Effectiveness</TableCell>
                      <TableCell>Owner</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {controls
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((control) => (
                        <TableRow key={control.id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={formData.controlIds.includes(control.id)}
                              onChange={() => handleControlSelect(control.id)}
                            />
                          </TableCell>
                          <TableCell>{control.name}</TableCell>
                          <TableCell>{control.controlType}</TableCell>
                          <TableCell>{control.controlNature}</TableCell>
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
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </Grid>
          </Grid>
        )}
        
        {/* Related Incidents */}
        {activeTab === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Related Incidents
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Search incidents..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconSearch size="1rem" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<IconPlus size="1rem" />}
                  onClick={() => setOpenIncidentModal(true)}
                >
                  Add New Incident
                </Button>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            formData.incidentIds.length > 0 &&
                            formData.incidentIds.length < incidents.length
                          }
                          checked={
                            incidents.length > 0 &&
                            formData.incidentIds.length === incidents.length
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                incidentIds: incidents.map(incident => incident.id)
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                incidentIds: []
                              }));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Financial Loss</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {incidents
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((incident) => (
                        <TableRow key={incident.id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={formData.incidentIds.includes(incident.id)}
                              onChange={() => handleIncidentSelect(incident.id)}
                            />
                          </TableCell>
                          <TableCell>{incident.title}</TableCell>
                          <TableCell>
                            <Chip
                              label={incident.severity}
                              size="small"
                              color={
                                incident.severity === 'CRITICAL' ? 'error' :
                                incident.severity === 'HIGH' ? 'warning' :
                                incident.severity === 'MEDIUM' ? 'info' : 'success'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(incident.incidentDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            ${incident.financialLoss?.toLocaleString() || '0'}
                          </TableCell>
                          <TableCell>{incident.status}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={incidents.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </Grid>
          </Grid>
        )}
        
        {/* Affected Business Units */}
        {activeTab === 4 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Affected Business Units
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            formData.affectedBusinessUnitIds.length > 0 &&
                            formData.affectedBusinessUnitIds.length < businessUnits.length
                          }
                          checked={
                            businessUnits.length > 0 &&
                            formData.affectedBusinessUnitIds.length === businessUnits.length
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                affectedBusinessUnitIds: businessUnits.map(unit => unit.id)
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                affectedBusinessUnitIds: []
                              }));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Code</TableCell>
                      <TableCell>Manager</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {businessUnits
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((unit) => (
                        <TableRow key={unit.id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={formData.affectedBusinessUnitIds.includes(unit.id)}
                              onChange={() => handleBusinessUnitSelect(unit.id)}
                            />
                          </TableCell>
                          <TableCell>{unit.name}</TableCell>
                          <TableCell>{unit.code}</TableCell>
                          <TableCell>
                            {users.find(u => u.id === unit.managerId)?.firstName || 'Unassigned'}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={businessUnits.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </Grid>
          </Grid>
        )}
        
        {/* Action buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/risk-management')}
            startIcon={<IconArrowLeft size="1.1rem" />}
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePreviousTab}
              startIcon={<IconArrowLeft size="1.1rem" />}
              disabled={activeTab === 0 || isLoading}
            >
              Previous
            </Button>
            
            <Button
              variant="contained"
              color="secondary"
              onClick={handleNextTab}
              startIcon={<IconArrowRight size="1.1rem" />}
              disabled={activeTab === 4 || isLoading}
            >
             Next
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Add Control Modal */}
      <Dialog open={openControlModal} onClose={() => setOpenControlModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Control</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Control Name"
                value={newControl.name}
                onChange={(e) => setNewControl({ ...newControl, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newControl.description}
                onChange={(e) => setNewControl({ ...newControl, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Control Type</InputLabel>
                <Select
                  value={newControl.controlType}
                  label="Control Type"
                  onChange={(e) => setNewControl({ ...newControl, controlType: e.target.value })}
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
                  value={newControl.controlNature}
                  label="Control Nature"
                  onChange={(e) => setNewControl({ ...newControl, controlNature: e.target.value })}
                >
                  <MenuItem value="MANUAL">Manual</MenuItem>
                  <MenuItem value="AUTOMATED">Automated</MenuItem>
                  <MenuItem value="IT_DEPENDENT">IT Dependent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
{/* Add other new fields */}
<Grid item xs={12}>
              <TextField 
                fullWidth
                label="Implementation Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newControl.implementationDate}
                onChange={(e) => setNewControl({ ...newControl, implementationDate: e.target.value })}
              />
            </Grid>
<Grid item xs={12}>

              <TextField
                fullWidth
                label="Review Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newControl.reviewDate}
                onChange={(e) => setNewControl({ ...newControl, reviewDate: e.target.value })}
                />
                </Grid>
                <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Tested Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newControl.lastTestedDate}
                onChange={(e) => setNewControl({ ...newControl, lastTestedDate: e.target.value })}
                />
                </Grid>
<Grid item xs={12}>
              <TextField
                fullWidth
                label="Next Test Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newControl.nextTestDate}
                onChange={(e) => setNewControl({ ...newControl, nextTestDate: e.target.value })}
                />

</Grid>
<Grid item xs={12}>
              <TextField
                fullWidth
                label="Testing Frequency"
                value={newControl.testingFrequency}
                onChange={(e) => setNewControl({ ...newControl, testingFrequency: e.target.value })}
                />
</Grid>
<Grid item xs={12}>
              <TextField
                fullWidth
                label="Testing Method"
                value={newControl.testingMethod}
                onChange={(e) => setNewControl({ ...newControl, testingMethod: e.target.value })}
                />
            </Grid>
<Grid item xs={12}>
              <TextField
                fullWidth
                label="Testing Results"
                value={newControl.testingResults}
                onChange={(e) => setNewControl({ ...newControl, testingResults: e.target.value })}
                />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth
                label="Testing Notes"
                value={newControl.testingNotes}
                onChange={(e) => setNewControl({ ...newControl, testingNotes: e.target.value })}
                />
                </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                Effectiveness: {newControl.effectiveness}%
              </Typography>
              <Slider
                value={newControl.effectiveness}
                onChange={(e, value) => setNewControl({ ...newControl, effectiveness: value })}
                min={1}
                max={100}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Owner</InputLabel>
                <Select
                  value={newControl.ownerId}
                  label="Owner"
                  onChange={(e) => setNewControl({ ...newControl, ownerId: e.target.value })}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenControlModal(false)}>Cancel</Button>
          <Button 
            onClick={handleAddControl}
            variant="contained"
            disabled={!newControl.name || isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Control'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Incident Modal */}
      <Dialog open={openIncidentModal} onClose={() => setOpenIncidentModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Incident</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                                label="Title"
                value={newIncident.title}
                onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newIncident.description}
                onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={newIncident.severity}
                  label="Severity"
                  onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value })}
                >
                  <MenuItem value="CRITICAL">Critical</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Financial Loss"
                value={newIncident.financialLoss}
                onChange={(e) => setNewIncident({ ...newIncident, financialLoss: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Incident Date"
                InputLabelProps={{ shrink: true }}
                value={newIncident.incidentDate}
                onChange={(e) => setNewIncident({ ...newIncident, incidentDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Detected Date"
                InputLabelProps={{ shrink: true }}
                value={newIncident.detectedDate}
                onChange={(e) => setNewIncident({ ...newIncident, detectedDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newIncident.status}
                  label="Status"
                  onChange={(e) => setNewIncident({ ...newIncident, status: e.target.value })}
                >
                {
                  incidentStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))
                }
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Reported Date"
                InputLabelProps={{ shrink: true }}
                value={newIncident.reportedDate}
                onChange={(e) => setNewIncident({ ...newIncident, reportedDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
              multiline
                rows={3}
                fullWidth
                label="Root Cause"
                value={newIncident.rootCause}
                onChange={(e) => setNewIncident({ ...newIncident, rootCause: e.target.value })}
              />
            </Grid>
        <Grid item xs={12}>
              <TextField
              multiline
                rows={3}
                fullWidth
                label="Immediate Actions"
                value={newIncident.immediateActions}
                onChange={(e) => setNewIncident({ ...newIncident, immediateActions: e.target.value })}
              />
            </Grid>
            {/* rEGULATORY  notification checkbox */}
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={newIncident.regulatoryNotification}
                    onChange={(e) => setNewIncident({ ...newIncident, regulatoryNotification: e.target.checked })}
                  />
                }
                label="Regulatory Notification Required"
              />
            </Grid>
            {/* Customer impact notification */}
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={newIncident.customerImpactNotification}
                    onChange={(e) => setNewIncident({ ...newIncident, customerImpactNotification: e.target.checked })}
                  />
                }
                label="Customer Impact Notification Required"
              />
              </Grid>
              {/* customer Impact Description */}
              <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Customer Impact Description"
                value={newIncident.customerImpactDescription}
                onChange={(e) => setNewIncident({ ...newIncident, customerImpactDescription: e.target.value })}
              />
            </Grid>
              {/* Affected Business Units */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Affected Business Units</InputLabel>
                  <Select
                    multiple
                    value={newIncident.affectedBusinessUnitIds}
                    onChange={(e) => setNewIncident({ ...newIncident, affectedBusinessUnitIds: e.target.value })}
                    renderValue={(selected) => 
                      selected.map(id => businessUnits.find(unit => unit.id === id)?.name).join(', ')
                    }
                  >
                    {businessUnits.map((unit) => (
                      <MenuItem key={unit.id} value={unit.id}>
                        <Checkbox
                          checked={newIncident.affectedBusinessUnitIds.includes(unit.id)}
                        />
                        <ListItemText primary={unit.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>


                
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Reporter</InputLabel>
                <Select
                  value={newIncident.reporterId}
                  label="Reporter"
                  onChange={(e) => setNewIncident({ ...newIncident, reporterId: e.target.value })}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenIncidentModal(false)}>Cancel</Button>
          <Button 
            onClick={handleAddIncident}
            variant="contained"
            disabled={!newIncident.title || isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Incident'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default AddRiskForm;