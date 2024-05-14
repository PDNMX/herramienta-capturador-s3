const url_api = import.meta.env.VITE_URL_API || process.env.VITE_URL_API;

let rutasConsulta = {
	"consultar.abstenciones.graves": url_api + `/S3/ABSTENCIONES-GRAVES/list`,
	"consultar.abstenciones.no-graves": url_api + `/S3/ABSTENCIONES-NO-GRAVES/list`,
	"consultar.actos-particulares.personas-fisicas": url_api + `/S3/PARTICULARES-PERSONAS-FISICAS-FALTAS-GRAVES/list`,
	"consultar.actos-particulares.personas-morales": url_api + `/S3/PARTICULARES-PERSONAS-MORALES-FALTAS-GRAVES/list`,
	"consultar.faltas-administrativas.graves": url_api + `/S3/SERVIDORES-FALTAS-GRAVES/list`,
	"consultar.faltas-administrativas.no-graves": url_api + `/S3/SERVIDORES-NO-GRAVES/list`,
	"consultar.hechos-corrupcion.personas-fisicas": url_api + `/S3/HECHOS-CORRUPCION-PERSONAS-FISICAS/list`,
	"consultar.hechos-corrupcion.personas-morales": url_api + `/S3/HECHOS-CORRUPCION-PERSONAS-MORALES/list`,
	"consultar.hechos-corrupcion.servidores-publicos": url_api + `/S3/HECHOS-CORRUPCION-SERVIDORES-PUBLICOS/list`,
	"consultar.inhabilitaciones.personas-fisicas": url_api + `/S3/INHABILITACIONES-PERSONAS-FISICAS/list`,
	"consultar.inhabilitaciones.personas-morales": url_api + `/S3/INHABILITACIONES-PERSONAS-MORALES/list`
}

export default rutasConsulta;
