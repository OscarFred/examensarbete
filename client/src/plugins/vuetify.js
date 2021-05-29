import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: colors.cyan,
                secondary: colors.red.lighten4,
                accent: colors.indigo.base,
            }
        }
    }
});
