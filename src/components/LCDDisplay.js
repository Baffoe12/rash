import React from 'react';
import { Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function LCDDisplay({ text }) {
  if (!text) {
    return (
      <Paper elevation={4} sx={{ p: 2, mb: 2, backgroundColor: '#ccc', color: '#333', fontFamily: 'monospace', borderRadius: 1 }}>
        <Typography variant="h6" fontFamily="monospace" fontWeight="bold" sx={{ letterSpacing: '0.5px' }}>
          No Display Data
        </Typography>
      </Paper>
    );
  }

  return (
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
          },
        }}
      >
        <Typography
          variant="h6"
          fontFamily="monospace"
          fontWeight="bold"
          sx={{
            textShadow: '0 0 5px rgba(224, 242, 241, 0.7)',
            letterSpacing: '0.5px',
          }}
        >
          {text}
        </Typography>
      </Paper>
    </motion.div>
  );
}
