import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import GetAppIcon from '@material-ui/icons/GetApp';
import Typography from "@material-ui/core/Typography";

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
}

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
};

const TableHeader = ({ classes, order, orderBy, onRequestSort, columns, download }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            sortDirection={orderBy === column.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : 'asc'}
              onClick={createSortHandler(column.id)}
            >
              {column.label}
              {orderBy === column.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {download && <TableCell style={{ width: '120px', textAlign: 'center' }}>Descarca</TableCell>}
      </TableRow>
    </TableHead>
  );
}

TableHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: '255px',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  label: {
    fontSize: '14px'
  },
  download: {
    cursor: 'pointer',
    transition: 'all .2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.2)',
    }
  },
  clickable: {
    cursor: 'pointer'
  },
  red: {
    background: '#FFCCCB'
  }
}));

const PaginatedTable = ({ columns, rows, totalRows, onPageChange, onLimitChange, onClick, download, onDownload, id, onTableDownload, downloadTable, pointer = false }) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const limit = parseInt(event.target.value, 10);
    onLimitChange(limit)
    setRowsPerPage(limit);
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  return (
    <div className={classes.root}>
        <Paper className={classes.paper}>
          <TableContainer>
            <Table
              id={id}
              className={classes.table}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
              aria-label="enhanced table"
            >
              <TableHeader
                classes={classes}
                columns={columns}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                download={download}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .map((row, index) => (
                    <TableRow
                      className={pointer && classes.clickable}
                      hover
                      key={`row-${index}`}
                      onClick={() => onClick(row.id)}
                    >
                      {Object.values(row).map((value) => (<TableCell>{value || '-'}</TableCell>))}
                      {download && (
                        <TableCell style={{ padding: '2px', textAlign: 'center' }}>
                          <GetAppIcon
                            className={classes.download}
                            onClick={() => onDownload(row.id)}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            {downloadTable && (
              <Typography variant="body2" style={{ display: 'flex', alignItems: 'center', marginRight: '25px' }}>
                <GetAppIcon
                  className={classes.download}
                  onClick={() => onTableDownload()}
                />
                Descarca tabelul
              </Typography>
            )}
            <FormControlLabel
              classes={{
                label: classes.label,
              }}
              control={<Switch checked={dense} onChange={handleChangeDense} />}
              label="Vizualizare restransa"
            />
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={totalRows}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </div>
        </Paper>
    </div>
  );
}

export default PaginatedTable;
