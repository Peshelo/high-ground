"use client";
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useParams, useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  Typography, 
  Grid, 
  Paper,
  Divider,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tabs,
  Tab,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link
} from '@mui/material';
import { 
  IconArrowLeft, 
  IconEdit,
  IconPrinter,
  IconDownload,
  IconShare2,
  IconChevronDown,
  IconAlertCircle,
  IconShieldCheck,
  IconAlertTriangle,
  IconClipboardList,
  IconBuilding
} from '@tabler/icons-react';

// API Service
const apiBaseUrl = 'http://4.222.232.224/api/v1';

async function fetchData(endpoint) {
  const response = await fetch(`${apiBaseUrl}${endpoint}`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}

const ViewRiskPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = React.useState(0);
  const [riskData, setRiskData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [relatedControls, setRelatedControls] = React.useState([]);
  const [relatedIncidents, setRelatedIncidents] = React.useState([]);
  const [businessUnits, setBusinessUnits] = React.useState([]);
  const [users, setUsers] = React.useState([]);

  // Fetch risk data and related information
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch risk data
        const risk = await fetchData(`/risks/${params.id}`);
        setRiskData(risk);
        
        // Fetch related controls if any
        if (risk.controlIds && risk.controlIds.length > 0) {
          const controls = await Promise.all(
            risk.controlIds.map(id => fetchData(`/risk-controls/${id}`))
          );
          setRelatedControls(controls);
        }
        
        // Fetch related incidents if any
        if (risk.incidentIds && risk.incidentIds.length > 0) {
          const incidents = await Promise.all(
            risk.incidentIds.map(id => fetchData(`/incidents/${id}`))
          );
          setRelatedIncidents(incidents);
        }
        
        // Fetch business units
        const units = await fetchData('/business-units');
        setBusinessUnits(units.content || []);
        
        // Fetch users
        const usersData = await fetchData('/users');
        setUsers(usersData.content || []);
        
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [params.id]);

  // Calculate risk rating
  const calculateRiskRating = () => {
    if (!riskData) return 'UNKNOWN';
    const score = (riskData.inherentProbability * riskData.inherentImpact) / 100;
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
  };

  const getColorForRating = (rating) => {
    switch (rating) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEdit = () => {
    router.push(`/risk-managment/risk/${params.id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading risk data...</Typography>
      </Box>
    );
  }

  if (!riskData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Risk not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          variant="outlined"
          onClick={() => router.push('/risk-managment')}
          startIcon={<IconArrowLeft size="1.1rem" />}
        >
          Back to Risks
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton onClick={handlePrint} title="Print Report">
            <IconPrinter />
          </IconButton>
          <IconButton title="Download PDF">
            <IconDownload />
          </IconButton>
          <IconButton title="Share">
            <IconShare2 />
          </IconButton>
          {/* <Button
            variant="contained"
            onClick={handleEdit}
            startIcon={<IconEdit size="1.1rem" />}
          >
            Edit Risk
          </Button> */}
        </Box>
      </Box>
      
      {/* Risk Title and Basic Info */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            {riskData.title}
          </Typography>
          
          <Chip
            label={riskData.status}
            color={
              riskData.status === 'APPROVED' ? 'success' :
              riskData.status === 'DRAFT' ? 'warning' : 'default'
            }
            size="medium"
          />
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <IconClipboardList />
                </ListItemIcon>
                <ListItemText 
                  primary="Risk ID" 
                  secondary={riskData.riskId || 'N/A'} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <IconAlertCircle />
                </ListItemIcon>
                <ListItemText 
                  primary="Category" 
                  secondary={riskData.category?.name || 'N/A'} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <IconShieldCheck />
                </ListItemIcon>
                <ListItemText 
                  primary="Type" 
                  secondary={riskData.type || 'N/A'} 
                />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <IconAlertTriangle />
                </ListItemIcon>
                <ListItemText 
                  primary="Risk Rating" 
                  secondary={
                    <Chip 
                      label={calculateRiskRating()} 
                      color={getColorForRating(calculateRiskRating())}
                      size="small"
                    />
                  } 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <IconBuilding />
                </ListItemIcon>
                <ListItemText 
                  primary="Owner" 
                  secondary={
                    riskData.owner ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                          {riskData.owner.firstName?.[0]}{riskData.owner.lastName?.[0]}
                        </Avatar>
                        {riskData.owner.firstName} {riskData.owner.lastName}
                      </Box>
                    ) : 'Unassigned'
                  } 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <IconClipboardList />
                </ListItemIcon>
                <ListItemText 
                  primary="Identified Date" 
                  secondary={new Date(riskData.identifiedDate).toLocaleDateString()} 
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabs for Detailed Information */}
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        <Tab label="Overview" />
        <Tab label="Assessment" />
        <Tab label="Controls" />
        <Tab label="Incidents" />
        <Tab label="Affected Units" />
        <Tab label="History" />
      </Tabs>
      
      {/* Overview Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <IconAlertCircle style={{ marginRight: 8 }} />
                Risk Description
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography paragraph>
                {riskData.description || 'No description provided'}
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                <IconAlertTriangle style={{ marginRight: 8 }} />
                Root Cause
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography paragraph>
                {riskData.rootCause || 'No root cause identified'}
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                <IconAlertTriangle style={{ marginRight: 8 }} />
                Consequences
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography paragraph>
                {riskData.consequences || 'No consequences described'}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Key Attributes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Priority" 
                    secondary={
                      <Chip 
                        label={riskData.priority} 
                        color={
                          riskData.priority === 'CRITICAL' ? 'error' :
                          riskData.priority === 'HIGH' ? 'warning' :
                          riskData.priority === 'MEDIUM' ? 'info' : 'success'
                        }
                        size="small"
                      />
                    } 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Regulatory Requirement" 
                    secondary={riskData.regulatoryRequirement ? 'Yes' : 'No'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Compliance Related" 
                    secondary={riskData.complianceRelated ? 'Yes' : 'No'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Version" 
                    secondary={riskData.version || '1.0'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Last Review Date" 
                    secondary={riskData.reviewDate ? new Date(riskData.reviewDate).toLocaleDateString() : 'Not reviewed'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Next Assessment Date" 
                    secondary={riskData.nextAssessmentDate ? new Date(riskData.nextAssessmentDate).toLocaleDateString() : 'Not scheduled'} 
                  />
                </ListItem>
              </List>
            </Paper>
            
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Stakeholders
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {riskData.stakeholders && riskData.stakeholders.length > 0 ? (
                <List dense>
                  {riskData.stakeholders.map(stakeholder => (
                    <ListItem key={stakeholder.id}>
                      <ListItemIcon>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                          {stakeholder.firstName?.[0]}{stakeholder.lastName?.[0]}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${stakeholder.firstName} ${stakeholder.lastName}`}
                        secondary={stakeholder.jobTitle} 
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No stakeholders assigned
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Assessment Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Risk Assessment
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">
                    Inherent Probability: {riskData.inherentProbability}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={riskData.inherentProbability} 
                    color={
                      riskData.inherentProbability >= 80 ? 'error' :
                      riskData.inherentProbability >= 50 ? 'warning' : 'info'
                    }
                    sx={{ height: 10, borderRadius: 5, mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2">
                    Inherent Impact: {riskData.inherentImpact}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={riskData.inherentImpact} 
                    color={
                      riskData.inherentImpact >= 80 ? 'error' :
                      riskData.inherentImpact >= 50 ? 'warning' : 'info'
                    }
                    sx={{ height: 10, borderRadius: 5, mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: theme.palette[getColorForRating(calculateRiskRating())].main,
                    borderRadius: 1,
                    backgroundColor: theme.palette[getColorForRating(calculateRiskRating())].light,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h5">
                      Risk Rating: 
                      <Box component="span" sx={{ ml: 1, fontWeight: 'bold' }}>
                        {calculateRiskRating()}
                      </Box>
                    </Typography>
                    <Typography variant="caption">
                      (Probability: {riskData.inherentProbability}% × Impact: {riskData.inherentImpact}%)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Financial Impact
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Potential Financial Impact" 
                    secondary={`${riskData.currency} ${riskData.potentialFinancialImpact?.toLocaleString() || '0'}`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Currency" 
                    secondary={riskData.currency || 'USD'} 
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Accordion>
                <AccordionSummary expandIcon={<IconChevronDown />}>
                  <Typography>Assumptions</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {riskData.assumptions || 'No assumptions documented'}
                  </Typography>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<IconChevronDown />}>
                  <Typography>External Factors</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {riskData.externalFactors || 'No external factors documented'}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Controls Tab */}
      {activeTab === 2 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Associated Controls
            </Typography>
            <Typography variant="subtitle2">
              {relatedControls.length} control(s) associated with this risk
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          {relatedControls.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Control Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Nature</TableCell>
                    <TableCell>Effectiveness</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Owner</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {relatedControls.map((control) => (
                    <TableRow key={control.id}>
                      <TableCell>
                        <Link href={`/controls/${control.id}`} underline="hover">
                          {control.name}
                        </Link>
                      </TableCell>
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
                        <Chip 
                          label={control.status} 
                          size="small"
                          color={
                            control.status === 'ACTIVE' ? 'success' :
                            control.status === 'INACTIVE' ? 'error' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {control.owner ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                              {control.owner.firstName?.[0]}{control.owner.lastName?.[0]}
                            </Avatar>
                            {control.owner.firstName} {control.owner.lastName}
                          </Box>
                        ) : 'Unassigned'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No controls associated with this risk
            </Typography>
          )}
        </Paper>
      )}
      
      {/* Incidents Tab */}
      {activeTab === 3 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Related Incidents
            </Typography>
            <Typography variant="subtitle2">
              {relatedIncidents.length} incident(s) related to this risk
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          {relatedIncidents.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Incident Title</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Financial Loss</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {relatedIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>
                        <Link href={`/incidents/${incident.id}`} underline="hover">
                          {incident.title}
                        </Link>
                      </TableCell>
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
                        <Chip 
                          label={incident.status} 
                          size="small"
                          color={
                            incident.status === 'CLOSED' ? 'success' :
                            incident.status === 'OPEN' ? 'warning' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {incident.currency || 'USD'} {incident.financialLoss?.toLocaleString() || '0'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No incidents related to this risk
            </Typography>
          )}
        </Paper>
      )}
      
      {/* Affected Units Tab */}
      {activeTab === 4 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Affected Business Units
            </Typography>
            <Typography variant="subtitle2">
              {riskData.affectedBusinessUnits?.length || 0} unit(s) affected by this risk
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          {riskData.affectedBusinessUnits && riskData.affectedBusinessUnits.length > 0 ? (
            <Grid container spacing={2}>
              {riskData.affectedBusinessUnits.map(unit => (
                <Grid item xs={12} sm={6} md={4} key={unit.id}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {unit.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Code: {unit.code}
                    </Typography>
                    {unit.manager && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Manager: {unit.manager.firstName} {unit.manager.lastName}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No business units affected by this risk
            </Typography>
          )}
        </Paper>
      )}
      
      {/* History Tab */}
      {activeTab === 5 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Risk History
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            History tracking will be implemented in a future release
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ViewRiskPage;