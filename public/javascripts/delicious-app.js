import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autoComplete from './modules/autocomplete';
import initMap from './modules/initMap';

autoComplete( $('#address'), $('#lat'), $('#lng') );
initMap( $('#map') );
