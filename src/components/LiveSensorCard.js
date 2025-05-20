import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Chip, Stack, Box, Paper, Button, Snackbar, Alert } from '@mui/material';
import SensorsIcon from '@mui/icons-material/Sensors';
import SaveIcon from '@mui/icons-material/Save';
import { motion } from 'framer-motion';

function statusColor(val, type) {
  if (type === 'alcohol') return val > 600 ? 'error' : val > 300 ? 'warning' : 'success';
  if (type === 'vibration') return val > 1000 ? 'error' : val > 500 ? 'warning' : 'success';
  if (type === 'distance') return val < 10 ? 'error' : val < 30 ? 'warning' : 'success';
  if (type === 'impact') return val > 2 ? 'error' : val > 1 ? 'warning' : 'success';
  return 'default';
}

export default function LiveSensorCard({ sensorData }) {
  console.log('LiveSensorCard sensorData:', sensorData); // Debug log
  const [savedData, setSavedData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const previousEngineState = useRef(null);

  // Function to check if engine is running based on LCD display
  const isEngineRunning = (lcdDisplay) => {
    if (!lcdDisplay) return false;
    return lcdDisplay.includes('Engine: RUNNING');
  };

  // Function to save current sensor data
  const saveSensorData = () => {
    if (!sensorData) return;

    // Create a new entry with timestamp
    const entry = {
      ...sensorData,
      savedAt: new Date().toISOString(),
      id: sensorData.id || Date.now() // Use existing ID or generate one
    };

    // Add to saved data array
    setSavedData(prev => {
      const newData = [...prev, entry];

      // Save to localStorage for persistence
      try {
        localStorage.setItem('safedrive_saved_data', JSON.stringify(newData));
      } catch (err) {
        console.error('Error saving to localStorage:', err);
      }

      return newData;
    });

    // Show success message
    setSnackbarMessage('Sensor data saved successfully!');
    setSnackbarOpen(true);
  };

  // Load saved data from localStorage on component mount
  useEffect(() => {
    try {
      const savedDataString = localStorage.getItem('safedrive_saved_data');
      if (savedDataString) {
        const parsed = JSON.parse(savedDataString);
        setSavedData(parsed);
      }
    } catch (err) {
      console.error('Error loading saved data:', err);
    }
  }, []);

  useEffect(() => {
    if (!sensorData) return;

    // Check if engine state changed from running to stopped
    const currentEngineRunning = isEngineRunning(sensorData.lcd_display);
    if (previousEngineState.current === true && currentEngineRunning === false) {
      console.log('Engine stopped! Saving sensor data...');
      // Save the data on engine stop
      saveSensorData();
    }
    previousEngineState.current = currentEngineRunning;
  }, [sensorData]);

  if (!sensorData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{mb:2}}><CardContent>Loading live sensor data...</CardContent></Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ mb: 2, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" gap={2} mb={2}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <SensorsIcon color="primary" fontSize="large" />
            </motion.div>
            <Typography variant="h6">Live Sensor Data</Typography>

            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'flex-end', 
              ml: 'auto',
              minWidth: '160px'
            }}>
            </Box>
          </Stack>

          {/* LCD Display Simulation */}
          {sensorData.lcd_display && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Paper 
                elevation={4} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  backgroundColor: '#00796b', 
                  color: '#e0f2f1',
                  fontFamily: 'monospace',
                  borderRadius: 1,
                  position: 'relative',
                  overflow: 'hidden',
                  border: '8px solid #004d40',
                  '&::before': {
                    content: '"LCD DISPLAY"',
                    position: 'absolute',
                    top: -10,
                    right: 10,
                    fontSize: '0.7rem',
                    color: '#b2dfdb',
                    transform: 'rotate(0deg)',
                    padding: '0 4px',
                  }
                }}
              >
                <Typography 
                  variant="h6" 
                  fontFamily="monospace" 
                  fontWeight="bold" 
                  sx={{ 
                    textShadow: '0 0 5px rgba(224, 242, 241, 0.7)',
                    letterSpacing: '0.5px'
                  }}
                >
                  {sensorData.lcd_display}
                </Typography>
              </Paper>
            </motion.div>
          )}

          <Box mt={2}>
            <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 1 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Chip 
                  label={`Alcohol: ${sensorData.alcohol}`} 
                  color={statusColor(sensorData.alcohol, 'alcohol')} 
                  sx={{ fontWeight: 'bold' }}
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Chip 
                  label={`Vibration: ${sensorData.vibration}`} 
                  color={statusColor(sensorData.vibration, 'vibration')} 
                  sx={{ fontWeight: 'bold' }}
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Chip 
                  label={`Distance: ${sensorData.distance}`} 
                  color={statusColor(sensorData.distance, 'distance')} 
                  sx={{ fontWeight: 'bold' }}
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Chip 
                  label={`Seatbelt: ${sensorData.seatbelt ? 'On' : 'Off'}`} 
                  color={sensorData.seatbelt ? 'success':'error'} 
                  sx={{ fontWeight: 'bold' }}
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Chip 
                  label={`Impact: ${sensorData.impact}`} 
                  color={statusColor(sensorData.impact, 'impact')} 
                  sx={{ fontWeight: 'bold' }}
                />
              </motion.div>
            </Stack>
            <Stack direction="row" gap={1} flexWrap="wrap">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Chip 
                  label={`Seatbelt: ${sensorData.seatbelt ? "Fastened" : "Unfastened"}`} 
                  color={sensorData.seatbelt ? "success" : "error"}
                  sx={{ fontWeight: 'bold' }}
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Chip 
                  label={`Impact: ${sensorData.impact}`} 
                  color={statusColor(sensorData.impact, 'impact')} 
                  sx={{ fontWeight: 'bold' }}
                />
              </motion.div>
            </Stack>
          </Box>

          {/* Saved Data Summary */}
          {savedData.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2" color="text.secondary">
                {savedData.length} data point{savedData.length !== 1 ? 's' : ''} automatically saved
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Data is automatically saved when the engine stops
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Notification Snackbar */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </motion.div>
  );
}
