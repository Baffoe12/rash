import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Alert
} from '@mui/material';

export default function AccidentImpactTable() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [accidentImpacts, setAccidentImpacts] = useState([]);
  const [error, setError] = useState(null);

  const handleRowClick = (row) => {
    setSelected(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'https://fire-h0u2.onrender.com'}/api/accidents`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch accident data: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // Map accident data to expected fields for display
        const mappedData = data.map(e => {
          let impactLevel = 'Low';
          if (e.impact > 8) impactLevel = 'High';
          else if (e.impact > 4) impactLevel = 'Medium';

          const summaryParts = [];
          if (e.alcohol > 0.05) summaryParts.push('Alcohol detected');
          if (e.seatbelt === false) summaryParts.push('Seatbelt not worn');
          if (e.impact > 8) summaryParts.push('Severe impact detected');
          if (e.vibration > 5) summaryParts.push('High vibration');
          if (e.distance < 10) summaryParts.push('Proximity warning');
          if (e.lcd_display) summaryParts.push(`LCD: "${e.lcd_display}"`);

          return {
            id: e.id,
            type: 'Accident',
            time: e.timestamp ? new Date(e.timestamp).toLocaleString() : '',
            impactLevel,
            summary: summaryParts.join('. ') + (summaryParts.length > 0 ? '.' : ''),
            details: e.lcd_display || '',
          };
        });
        setAccidentImpacts(mappedData);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching accident data:', err);
        setError('Failed to fetch accident data. Please try again later.');
      });
  }, []);

  // Limit to 3 most recent accident impacts
  const displayedAccidents = accidentImpacts.slice(0, 3);

  return (
    <Box my={5}>
      <Typography variant="h5" fontWeight="bold" mb={2} color="#000">
        Accident Impact Log
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TableContainer component={Paper} sx={{ borderRadius: 3, background: 'linear-gradient(135deg,#f5f5f5 0%,#e0e0e0 100%)', boxShadow: 8 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Time</TableCell>
              <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Impact Level</TableCell>
              <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Summary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedAccidents.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{ cursor: 'pointer', ':hover': { background: 'rgba(229,57,53,0.09)' } }}
                onClick={() => handleRowClick(row)}
              >
                <TableCell sx={{ color: '#000' }}>{row.type}</TableCell>
                <TableCell sx={{ color: '#000' }}>{row.time}</TableCell>
                <TableCell sx={{ color: row.impactLevel === 'High' ? '#e53935' : row.impactLevel === 'Medium' ? '#ffb300' : '#43a047', fontWeight: 'bold' }}>{row.impactLevel}</TableCell>
                <TableCell sx={{ color: '#000' }}>{row.summary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for report detail */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Accident Report Detail</DialogTitle>
        <DialogContent>
          {selected && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {selected.type} ({selected.impactLevel})
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Time: {selected.time}
              </Typography>
              <Typography variant="body1" mt={2}>
                {selected.details}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
