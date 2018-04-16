import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import _ from 'lodash';
import EventBus from './helpers/EventBus';
// Partials
import ThemeHeader from './partials/ThemeHeader.vue'
import ThemeFooter from './partials/ThemeFooter.vue'
// Configs
import Routes from './configs/routes'


axios.defaults.headers.common = {
    'X-WP-Nonce': window.wp.nonce
};

Vue.prototype.$http = axios;
Vue.prototype.$parallax = new Parallax;

Vue.use(VueRouter);
Vue.config.debug = true;

// device detection
window.isMobile = false; //initiate as false
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    window.isMobile = true;
}

if(navigator.userAgent.match(/Trident\/7\./)) { // if IE
    document.body.addEventListener("mousewheel", function () {
        // remove default behavior
        event.preventDefault();

        //scroll without smoothing
        var wheelDelta = event.wheelDelta;
        var currentScrollPosition = window.pageYOffset;
        window.scrollTo(0, currentScrollPosition - wheelDelta);
    });
}

/*
  --- ROUTER ---
 */
let router;
axios.get(wp.root + 'api/v1/init?lang=' + wp.current_language).then((response) => {
    router = new Routes(response);
    window.wp.projects = response.data.projects;

    let App = new Vue({
        router,
        data: {
            menu: response.data.menu,
            meta: response.data.meta,
            frontpage: response.data.frontpage,
            animating: false,
            loading: true,
            leaving: false,
            pageColor: 'black',
            resizeTimeout: 0,
            currentSize: '',
            paddingTop: 0,
            jumpTo: null,
            lang: window.wp.current_language ? window.wp.current_language : 'de'
        },
        created() {
            //this.paddingTop = document.querySelector('header').offsetHeight + 'px';
        },
        mounted() {

            this.currentSize = this.getCurrentSize();
            window.addEventListener('resize', () => {
                clearTimeout(this.resizeTimeout);
                this.resizeTimeout = setTimeout(() => {
                    if(this.getCurrentSize() != this.currentSize) {
                        this.currentSize = this.getCurrentSize();
                        EventBus.$emit('changedSize', this.currentSize);
                        this.paddingTop = document.querySelector('header').offsetHeight + 'px';
                    }
                    EventBus.$emit('resized', this.currentSize);
                }, 100)

            });

            EventBus.$on('pageColor', (color) => {
                setTimeout(() => this.pageColor = color, 500);
            });

            EventBus.$on('pageLoading', (color) => {
                this.loading = true;
            });
            EventBus.$on('pageResized', (color) => {
                this.loading = false;

                this.$nextTick(() => {

                    let header = document.querySelector('#header');
                    document.querySelector('#app').style.paddingTop = header.offsetHeight + 'px';

                });
            });

            EventBus.$on('pageRendered', () => {
                let header = document.querySelector('#header');
                document.querySelector('#app').style.paddingTop = header.offsetHeight + 'px';
                setTimeout(() => {
                    this.loading = false;
                    this.leaving = true;
                    setTimeout(() => this.leaving = false, 500);
                    this.$nextTick(() => {

                            let header = document.querySelector('#header');
                            document.querySelector('#app').style.paddingTop = header.offsetHeight + 'px';

                            SMController.update();

                            if(this.jumpTo) {
                                jump('#' + this.jumpTo[0], {
                                    duration: 500,
                                    offset: this.jumpTo[1] ? this.jumpTo[1] : 0,
                                    callback: () => {
                                        //this.activeIndex = key;
                                    }
                                });
                                this.jumpTo = null;
                            }
                    });
                }, 10);
            })
        },
        watch: {
            '$route' (to, from) {

            }
        },
        components: {
            ThemeHeader,
            ThemeFooter
        },
        methods: {
            translate(string) {
                if(window.wp.translations[string]) {
                    return window.wp.translations[string];
                }
                return string;
            },
            getCurrentSize() {
                let size = 'small';
                if(window.innerWidth > 1400) size = 'large';
                else if(window.innerWidth > 1024) size = 'large';
                else if(window.innerWidth > 768) size = 'medium';
                else size = 'small';

                return size;
            }
        },
        template:
            `<div id="app" :class="{white: pageColor == 'white', small: currentSize == 'small',  medium: currentSize == 'medium', large: currentSize == 'large'}">
                <theme-header :menu="menu"></theme-header>
                <main class="wrapper">
                    <div class="loading" :class="{active: loading, leave: leaving}"></div>
                    <router-view class="child-view" :key="$route.path"></router-view>
                </main>
                <theme-footer></theme-footer>
            </div>`
    }).$mount('#app');
});
