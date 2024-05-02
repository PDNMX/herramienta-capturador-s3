import { combineReducers } from 'redux';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import {pagination} from "./pagination.reducer";
import { alert } from './alert.reducer';
import { providers } from './providers.reducer';
import {providerSelect } from './providerTemporal.reducer';
import {userSelect } from './userTemporal.reducer';
import {userInSession} from './userInSession.reducer';
import {catalogs} from './catalog.reducer';
import {S2} from './S2Schema.reducer';
import {vigencia} from './vigenciaPassword.reducer';
import {rol} from './rolUser.reducer';
import {permisos} from "./permisosSistemasUser.reducer";
import {providerUser} from "./providerUser.reducer";
import {providersEnabled} from "./providerEnabled.reducer";

const rootReducer = combineReducers({
    users,
    alert,
    registration,
    pagination,
    providers,
    providerSelect,
    catalogs,
    S2,
    userInSession,
    userSelect,
    vigencia,
    rol,
    permisos,
    providerUser,
    providersEnabled
});

export default rootReducer;
