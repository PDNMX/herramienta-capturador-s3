import { Link, Typography, Stack } from '@mui/material';

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://www.plataformadigitalnacional.org" target="_blank" underline="hover">
    plataformadigitalnacional.org
    </Typography>
    <Typography variant="subtitle2" component={Link} href="https://www.sna.org.mx" target="_blank" underline="hover">
    sna.org.mx
    </Typography>
    {/* <Typography variant="subtitle2" component={Link} href="https://www.sesna.gob.mx" target="_blank" underline="hover">
    sesna.gob.mx
    </Typography> */}
  </Stack>
);

export default AuthFooter;
