import withStyles from '@mui/styles/withStyles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = withStyles((theme) =>
    createStyles({
        head: {
            backgroundColor: '#ffe01b',
            color: '#666666'
        },
        body: {
            fontSize: 14,
        },
    }),
)(TableCell);

const StyledTableRow = withStyles((theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),
)(TableRow);

function createData(id, tipo, titulo, url, fecha, descripcion) {
    return { id, tipo, titulo, url, fecha, descripcion};
}



const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

export default function DocumentTable(props) {
    const classes = useStyles();
    const rows = props.documents.map(e => createData(e.id, e.tipo, e.titulo, e.url, e.fecha, e.descripcion));
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell><b>Tipo</b></StyledTableCell>
                        <StyledTableCell align="left"><b>Título</b></StyledTableCell>
                        <StyledTableCell align="left"><b>URL</b></StyledTableCell>
                        <StyledTableCell align="left"><b>Fecha</b></StyledTableCell>
                        <StyledTableCell align="left"><b>Descripción</b></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell component="th" scope="row">
                                {row.tipo ? row.tipo : '(DNC)'}
                            </StyledTableCell>
                            <StyledTableCell align="left">{row.titulo}</StyledTableCell>
                            <StyledTableCell align="left">{row.url}</StyledTableCell>
                            <StyledTableCell align="left">{row.fecha}</StyledTableCell>
                            <StyledTableCell align="left">{row.descripcion}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
