<template>
    <div class="page">
       
        <div class="wrap">
            
        </div>

    </div>
</template>
<script type="text/javascript">
    import EventBus from '../helpers/EventBus';

    export default {
        name: 'page',
        props: {
            id: Number
        },
        components: {

        },
        data() {
            return {
                page: {},
                title: '',
                content: ''
            }
        },
        created() {
            EventBus.$emit('pageLoading');

            this.$http.get('/wp-json/wp/v2/pages/' + this.id )
                .then((response) => {

                    this.page = response.data;
                    this.title = response.data.title.rendered;
                    this.content = response.data.content.rendered;


                })
                .catch(() => {

                })
        },
        methods: {
        
        }
    }
</script>