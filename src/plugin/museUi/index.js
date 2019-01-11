import Vue from 'vue';
import 'muse-ui/dist/muse-ui.css';

import MuseUI from 'muse-ui';
Vue.use(MuseUI);


import theme from 'muse-ui/lib/theme';
theme.add('teal', {
  primary: '#ec4924'
}, 'light');

theme.use('teal');
