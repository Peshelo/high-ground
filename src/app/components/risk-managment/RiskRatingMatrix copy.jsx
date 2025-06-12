"use client"
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';

const PBTRiskMatrix = () => {
  const [selectedProbability, setSelectedProbability] = useState(null);
  const [selectedImpact, setSelectedImpact] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState(null);

  // Risk matrix data
  const probabilityLevels = [
    { id: 5, label: 'Almost Certain', color: '#8B5CF6' },
    { id: 4, label: 'Likely', color: '#10B981' },
    { id: 3, label: 'Possible', color: '#F59E0B' },
    { id: 2, label: 'Unlikely', color: '#10B981' },
    { id: 1, label: 'Rare', color: '#059669' }
  ];

  const impactLevels = [
    { id: 1, label: 'Insignificant', color: '#059669' },
    { id: 2, label: 'Low', color: '#10B981' },
    { id: 3, label: 'Significant', color: '#F59E0B' },
    { id: 4, label: 'Serious', color: '#F97316' },
    { id: 5, label: 'Catastrophic', color: '#DC2626' }
  ];

  // Risk matrix cells with their corresponding risk levels
  const riskMatrix = [
    [
      { risk: 'Low', color: '#10B981' },
      { risk: 'Moderate', color: '#F59E0B' },
      { risk: 'High', color: '#F97316' },
      { risk: 'High', color: '#F97316' },
      { risk: 'Critical', color: '#DC2626' }
    ],
    [
      { risk: 'Low', color: '#10B981' },
      { risk: 'Moderate', color: '#F59E0B' },
      { risk: 'Moderate', color: '#F59E0B' },
      { risk: 'High', color: '#F97316' },
      { risk: 'Critical', color: '#DC2626' }
    ],
    [
      { risk: 'Negligible', color: '#059669' },
      { risk: 'Low', color: '#10B981' },
      { risk: 'Moderate', color: '#F59E0B' },
      { risk: 'Moderate', color: '#F59E0B' },
      { risk: 'High', color: '#F97316' }
    ],
    [
      { risk: 'Negligible', color: '#059669' },
      { risk: 'Negligible', color: '#059669' },
      { risk: 'Low', color: '#10B981' },
      { risk: 'Moderate', color: '#F59E0B' },
      { risk: 'Moderate', color: '#F59E0B' }
    ],
    [
      { risk: 'Negligible', color: '#059669' },
      { risk: 'Negligible', color: '#059669' },
      { risk: 'Negligible', color: '#059669' },
      { risk: 'Low', color: '#10B981' },
      { risk: 'Low', color: '#10B981' }
    ]
  ];

  const riskColors = {
    'Negligible': '#059669',
    'Low': '#059669',
    'Moderate': '#10B981',
    'High': '#F59E0B',
    'Critical': '#DC2626'
  };

  const handleCellClick = (probIndex, impactIndex) => {
    const cell = riskMatrix[probIndex][impactIndex];
    setSelectedProbability(probIndex + 1);
    setSelectedImpact(impactIndex + 1);
    setSelectedRisk(cell);
  };

  const handleProbabilitySelect = (probId) => {
    setSelectedProbability(probId);
    if (selectedImpact) {
      const cell = riskMatrix[5 - probId][selectedImpact - 1];
      setSelectedRisk(cell);
    }
  };

  const handleImpactSelect = (impactId) => {
    setSelectedImpact(impactId);
    if (selectedProbability) {
      const cell = riskMatrix[5 - selectedProbability][impactId - 1];
      setSelectedRisk(cell);
    }
  };

  const getRiskRating = () => {
    if (!selectedRisk) return null;
    return selectedRisk.risk;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Risk Matrix - Based on PBT
      </Typography>

      {/* Selection Controls */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Probability</InputLabel>
            <Select
              value={selectedProbability || ''}
              label="Probability"
              onChange={(e) => handleProbabilitySelect(e.target.value)}
            >
              {probabilityLevels.map((level) => (
                <MenuItem key={level.id} value={level.id}>
                  {level.id} - {level.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Impact</InputLabel>
            <Select
              value={selectedImpact || ''}
              label="Impact"
              onChange={(e) => handleImpactSelect(e.target.value)}
            >
              {impactLevels.map((level) => (
                <MenuItem key={level.id} value={level.id}>
                  {level.id} - {level.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Risk Rating Display */}
      {selectedRisk && (
        <Card sx={{ mb: 4, bgcolor: riskColors[selectedRisk.risk], color: 'white' }}>
          <CardContent>
            <Typography variant="h5" align="center">
              Risk Rating: {getRiskRating()}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Risk Matrix */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Grid container>
          {/* Y-axis labels */}
          <Grid item xs={2}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column-reverse' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60 }}>
                <Typography variant="body2" sx={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}>
                  Probability
                </Typography>
              </Box>
              {probabilityLevels.map((level, index) => (
                <Box
                  key={level.id}
                  sx={{
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundColor: selectedProbability === level.id ? level.color : 'transparent',
                    color: selectedProbability === level.id ? 'white' : 'text.primary',
                    '&:hover': { backgroundColor: level.color, color: 'white' },
                    transition: 'all 0.2s'
                  }}
                  onClick={() => handleProbabilitySelect(level.id)}
                >
                  <Tooltip title={level.range}>
                    <Typography variant="caption" sx={{ textAlign: 'center', fontSize: '0.7rem' }}>
                      {level.id} - {level.label}
                    </Typography>
                  </Tooltip>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Matrix cells */}
          <Grid item xs={10}>
            <Box>
              {/* Matrix grid */}
              {riskMatrix.map((row, rowIndex) => (
                <Box key={rowIndex} sx={{ display: 'flex' }}>
                  {row.map((cell, colIndex) => (
                    <Box
                      key={`${rowIndex}-${colIndex}`}
                      sx={{
                        width: 120,
                        height: 60,
                        border: '1px solid #ccc',
                        backgroundColor: cell.color,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        opacity: selectedProbability === (5 - rowIndex) && selectedImpact === (colIndex + 1) ? 1 : 0.8,
                        transform: selectedProbability === (5 - rowIndex) && selectedImpact === (colIndex + 1) ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          opacity: 1,
                          zIndex: 1
                        }
                      }}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      <Tooltip title={`Risk: ${cell.risk}`}>
                        <Typography variant="caption" sx={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          {cell.risk}
                        </Typography>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
              ))}

              {/* X-axis labels */}
              <Box sx={{ display: 'flex', mt: 1 }}>
                {impactLevels.map((level) => (
                  <Box
                    key={level.id}
                    sx={{
                      width: 120,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backgroundColor: selectedImpact === level.id ? level.color : 'transparent',
                      color: selectedImpact === level.id ? 'white' : 'text.primary',
                      '&:hover': { backgroundColor: level.color, color: 'white' },
                      transition: 'all 0.2s'
                    }}
                    onClick={() => handleImpactSelect(level.id)}
                  >
                    <Typography variant="caption" sx={{ textAlign: 'center', fontSize: '0.7rem' }}>
                      {level.id} - {level.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
                Impact
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Legend */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
          {Object.entries(riskColors).map(([risk, color]) => (
            <Chip
              key={risk}
              label={risk}
              sx={{
                backgroundColor: color,
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          ))}
        </Box>

        {/* Risk numbering */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Typography variant="caption" color="error">1</Typography>
          <Typography variant="caption" color="warning.main">2</Typography>
          <Typography variant="caption" color="info.main">3</Typography>
          <Typography variant="caption" color="warning.main">5</Typography>
          <Typography variant="caption" color="error">8</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default PBTRiskMatrix;