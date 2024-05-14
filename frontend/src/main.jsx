import ReactDOM from 'react-dom'
import { App } from "./app/components/App";
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { esES } from '@mui/material/locale';

const theme = createTheme({
  palette: {
      primary: {
          main: '#9085DA'
      }
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          whiteSpace: 'normal', // Aplica el estilo al elemento select
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& tbody .MuiTableRow-root': {
            backgroundColor: 'transparent', // Fondo transparente para las filas impares
          },
          '& tbody .MuiTableRow-root:nth-of-type(odd)': {
            backgroundColor: '#f5f5f5', // Fondo gris claro para las filas pares
          },
          '& tbody .MuiTableRow-root:hover': {
            backgroundColor: '#9085da5e', // Color de resaltado al pasar el cursor
          },
        },
      },
    }
  },
}, esES);

ReactDOM.render(
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
            <App/>
        </ThemeProvider>
    </StyledEngineProvider>,
  document.getElementById("root")
)
