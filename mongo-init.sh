# mongo-init.sh
set -e
mongosh <<EOF
use $MONGO_INITDB_DATABASE
db.createCollection('usuarios')
db.usuarios.insertOne({
  nombre: '',
  apellidoUno: '',
  apellidoDos: '',
  cargo: '',
  correoElectronico: '',
  telefono: '',
  extension: '',
  usuario: '$ADMIN_USER',
  contrasena: '$(echo -n "$ADMIN_PASSWORD" | sha256sum | cut -c-64)',
  sistemas: [ "faltas-administrativas.graves", "actos-particulares.personas-morales", "hechos-corrupcion.personas-morales", "abstenciones.graves", "faltas-administrativas.no-graves", "actos-particulares.personas-fisicas", "hechos-corrupcion.servidores-publicos", "hechos-corrupcion.personas-fisicas", "abstenciones.no-graves" ],
  proveedorDatos: 'Proveedor DEMO',
  fechaAlta: '2021-01-15T15:28:28-06:00',
  vigenciaContrasena: '2029-04-15T15:28:28-05:00',
  estatus: true,
  rol: '1',
  contrasenaNueva: false,
})

db.createCollection('clients')
db.clients.insert([{ 
  clientId: '$CLIENT_ID', 
  clientSecret: '$CLIENT_SECRET', 
  grants: [] 
}])

EOF
