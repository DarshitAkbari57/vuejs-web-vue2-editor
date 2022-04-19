<template>
    <div class="card card-3" v-if="array.length>0">
      <div class="label" @click="selectText(item)" v-for="item in array">
        <a>{{item}}</a>
      </div>
    </div>
</template>

<script>
export default {
    name: "Selector",
    props:{
        array: {
            type: Array,
            default: () => []
        },
        selectText:{type:Function}
    }
};
</script>

<style lang="scss">

.card {
  background: #fff;
  border-radius: 2px;
  display: inline-block;
  height: 300px;
  margin: 1rem;
  position: relative;
  width: 300px;
}
.card.card-3 div{
  padding: 10px;
}

.label:hover{
  background-color:#b45ad3 ;
}

.card-3 {
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}

</style>
