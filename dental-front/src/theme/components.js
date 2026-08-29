export const components = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: '#f8f9ff',
        color: '#0d1c2e',
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '10px 16px',
        minHeight: 40,
      },
      containedPrimary: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.10)',
        '&:hover': {
          backgroundColor: '#00629e',
        },
      },
      sizeLarge: {
        padding: '12px 20px',
        minHeight: 48,
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      size: 'small',
      fullWidth: true,
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        backgroundColor: '#ffffff',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#005e97',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#005e97',
          borderWidth: 1,
        },
        '&.Mui-focused': {
          boxShadow: '0 0 0 4px rgba(0, 94, 151, 0.20)',
        },
      },
      notchedOutline: {
        borderColor: '#c0c7d2',
      },
      input: {
        padding: '10px 14px',
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.05em',
        color: '#0d1c2e',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      rounded: {
        borderRadius: 12,
      },
      elevation1: {
        boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(192, 199, 210, 0.30)',
      },
    },
  },
  MuiAppBar: {
    defaultProps: {
      elevation: 0,
      color: 'inherit',
    },
    styleOverrides: {
      root: {
        backgroundColor: '#f8f9ff',
        color: '#0d1c2e',
        borderBottom: '1px solid #c0c7d2',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: '#f8f9ff',
        borderRight: '1px solid #c0c7d2',
        width: 256,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 600,
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: '0 8px 8px 0',
        marginRight: 8,
      },
    },
  },
}
