<template>


    <div>

            <router-view></router-view>
    <div><bottom></bottom></div>
    </div>
</template>
<script>
    import bottom from './footer'
    // import index from './suyuanindex'

    export default {
        components: {
            bottom,

        }
    }
</script>