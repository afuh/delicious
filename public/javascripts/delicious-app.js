import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autoComplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';
import ajaxHeart from './modules/heart';
import initMap from './modules/initMap';

autoComplete( $('#address'), $('#lat'), $('#lng') );

typeAhead( $('.search') );

// General map
makeMap( $('#map') );

// Store map
initMap( $('#mapStore') );

const heartForms = $$('form.heart');
heartForms.on('submit', ajaxHeart);
