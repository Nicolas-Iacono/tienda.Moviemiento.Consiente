import React, { useState, useRef, useEffect } from "react";
import useSearch from "./useSearch";
import { 
  TextField, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper, 
  Box, 
  Divider,
  InputAdornment,
  Typography,
  Fade,
  IconButton,
  Chip,
  ClickAwayListener,
  Popper,
  useMediaQuery,
  useTheme,
  Portal
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useRouter } from "next/router";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const { results, loading, clearResults } = useSearch(query);
  const router = useRouter();
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleViewDetails = (id) => {
    setQuery("");
    setIsOpen(false);
    setShowSearchBar(false);
    clearResults();
    router.push(`/product/${id}`);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    clearResults();
  };

  const handleClose = () => {
    setIsOpen(false);
    if (isMobile) {
      setShowSearchBar(false);
    }
    clearResults();
  };

  const handleSearchIconClick = () => {
    setShowSearchBar(true);
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  };

  // Manejar teclas
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'Enter' && results.length > 0) {
      handleViewDetails(results[0].id);
    }
  };

  const SearchResults = () => (
    <List sx={{ py: 0, maxHeight: '60vh', overflowY: 'auto' }}>
      {results.map((product, index) => (
        <React.Fragment key={product.id}>
          {index > 0 && <Divider />}
          <ListItem
            button
            onClick={() => handleViewDetails(product.id)}
            sx={{
              py: 1.5,
              px: 2,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemAvatar>
              <Avatar
                variant="rounded"
                src={product.imagenes?.[0] || product.images?.[0]}
                alt={product.nombre || product.name}
                sx={{ width: 48, height: 48 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="subtitle1" noWrap>
                  {product.nombre || product.name}
                </Typography>
              }
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip
                    icon={<LocalOfferIcon sx={{ fontSize: '0.8rem !important' }} />}
                    label={`$${Number(product.precioVenta || product.price).toLocaleString()}`}
                    size="small"
                    color="primary"
                    sx={{ height: 24 }}
                  />
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {product.marca || product.brand}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        </React.Fragment>
      ))}
    </List>
  );

  const LoadingIndicator = () => (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <CircularProgress size={24} />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Buscando productos...
      </Typography>
    </Box>
  );

  if (isMobile && !showSearchBar) {
    return (
      <IconButton
        onClick={handleSearchIconClick}
        sx={{
          width: 100,
          height: 30,
          borderRadius: '15px',
          backgroundColor: 'background.paper',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
          boxShadow: 1,
        }}
      >
        <SearchIcon />
      </IconButton>
    );
  }

  const SearchBarContent = (
    <ClickAwayListener onClickAway={handleClose}>
      <Box
        ref={searchRef}
        sx={{
          position: "relative",
          width: { xs: "80%", sm: "350px", md: "400px" },
          zIndex: 1200,
          ...(isMobile && {
            position: 'fixed',
            top: '70px', // Ajusta esto según la altura de tu header
            left: '50%',
            transform: 'translateX(-50%)',
          })
        }}
      >
        <TextField
          fullWidth
          inputRef={inputRef}
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          onClick={() => setIsOpen(true)}
          placeholder="Buscar productos..."
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loading ? (
                  <CircularProgress size={20} />
                ) : query ? (
                  <IconButton
                    size="small"
                    onClick={clearSearch}
                    sx={{ p: 0.5 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                ) : isMobile && (
                  <IconButton
                    size="small"
                    onClick={handleClose}
                    sx={{ p: 0.5 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'background.paper',
              },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'divider',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />

        <Popper
          open={isOpen && (results.length > 0 || loading)}
          anchorEl={searchRef.current}
          placement={isMobile ? "bottom" : "bottom-start"}
          style={{ 
            width: isMobile ? '80%' : '100%', 
            zIndex: 1300,
            ...(isMobile && {
              position: 'fixed',
              left: '50%',
              transform: 'translateX(-50%)',
            })
          }}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps}>
              <Paper
                elevation={4}
                sx={{
                  width: '100%',
                  mt: 1,
                  maxHeight: '60vh',
                  overflowY: 'auto',
                  borderRadius: 2,
                }}
              >
                {loading ? (
                  <LoadingIndicator />
                ) : results.length > 0 ? (
                  <SearchResults />
                ) : query ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      No se encontraron productos
                    </Typography>
                  </Box>
                ) : null}
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );

  return isMobile ? (
    <Portal>
      {showSearchBar && SearchBarContent}
    </Portal>
  ) : (
    SearchBarContent
  );
};

export default SearchBar;
