import AppBar from '@material-ui/core/AppBar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import GoogleBtn from './GoogleBtn';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Box, Grid, Button, Container } from '@material-ui/core';
import { clearData } from './IndexedDBController';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { storeMediaItems, getTimeStamp, setTimeStamp } from './IndexedDBController';
import { requestAllMediaItems, requestNewMediaItems} from './GapiConnection';
import { useAccessToken } from './AccessContext';

export default function MyAppBar(props) {
  const drawerWidth = 240;
  const useStyles = makeStyles((theme) => ({
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    title: {
      [theme.breakpoints.down('xs')]: {
        fontSize: '1rem',
      },
      [theme.breakpoints.up('lg')]: {
        fontSize: '1.2rem',
      },
    },
    offset: theme.mixins.toolbar,
  }));
  
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  let justifyStyle;
  matches ? justifyStyle='flex-end' : justifyStyle='center';

  const accessToken = useAccessToken();
  const [isOpen, setIsOpen] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState('');

  const handleDrawerOpen = () => {
    setIsOpen(true);
  };
  const handleDrawerClose = () => {
    setIsOpen(false);
  };

  const handleClear = () => {
    clearData();
    setTimeStamp('');
    setLastUpdateTime(getTimeStamp());
  };
  
  const handleUpdate = () => {
    requestAllMediaItems(accessToken).then((fulfilled) => {
      console.log('Update completed!');
      // Update the LastUpdateView
      setLastUpdateTime(getTimeStamp());
    });
  }

  const getNewLastUpdateTime = () => {
    setLastUpdateTime(getTimeStamp());
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const addZero = (input) => {
      if (input.length < 2) input = '0' + input;
    };
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hours = '' + d.getHours(),
      minutes = '' + d.getMinutes(),
      seconds = '' + d.getSeconds();

    addZero(month);
    addZero(day);
    addZero(hours);
    addZero(minutes);
    addZero(seconds);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div>
      <CssBaseline />
      <AppBar
        position="sticky"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: isOpen,
        })}
      >
        <Toolbar>
          <Grid container alignItems='center' justify='flex-start' spacing={1}>
            <Grid
              container
              item
              justify='flex-start'
              alignItems='center'
              lg={4}
              md={5}
              xs={12}
            >
              <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={handleDrawerOpen}
                edge='start'
                className={clsx(classes.menuButton, isOpen && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant='h6' className={classes.title}>
                Google Photos Search Enhancer
              </Typography>
            </Grid>
            <Grid
              container
              item
              alignItems='center'
              justify='flex-start'
              lg={5}
              md={6}
              xs={12}
            >
              <SearchBar onPhotos={props.onPhotos} />
            </Grid>
            <Grid
              container
              item
              alignItems='center'
              justify={justifyStyle}
              xs={12}
              md={1}
              lg={3}
            >
              <GoogleBtn
                onLastUpdateTime={() => setLastUpdateTime(getTimeStamp())}
                lastUpdateTime={lastUpdateTime}
              />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {/* <div className={classes.offset} /> */}
      {/* <Box></Box> */}
      {/* <Toolbar /> */}
      <Drawer
        className={classes.drawer}
        variant='persistent'
        anchor='left'
        open={isOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button>
            <ListItemText primary='Update data' onClick={handleUpdate} />
          </ListItem>
          <ListItem button>
            <ListItemText primary='Clear data' onClick={handleClear} />
          </ListItem>
          <ListItem button>
            <ListItemText primary='Random Sort' />
          </ListItem>
          <ListItem button>
            <ListItemText primary='Stop' />
          </ListItem>
        </List>
        <Divider/>
          <Typography variant='subtitle1' display='block' gutterBottom className={classes.content} color='textSecondary'>
            <Box>
              Last Update:
            </Box>
            {lastUpdateTime ? formatDate(lastUpdateTime) : 'No data'}
          </Typography>
      </Drawer>
    </div>
  );
}
