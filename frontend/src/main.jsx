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
