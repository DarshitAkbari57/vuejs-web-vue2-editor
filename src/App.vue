<template>
  <div id="app">
    <Title/>
    <VueEditor
      ref="vEditor"
      v-model="content"
      use-custom-image-handler
      use-markdown-shortcuts
      @text-change="handleTextChange"
      @focus="onEditorFocus"
      @blur="onEditorBlur"
      @imageAdded="handleImageAdded"
      @image-removed="handleImageRemoved"
    />
    <Selector :array.sync="array" :selectText="selectText"/>
  </div>
</template>

<script>
// import axiosInstance from "@/helpers/axios";
import axios from "axios";
import Quill from "quill";
const AlignStyle = Quill.import("attributors/style/align");
Quill.register(AlignStyle, true);

const BlockEmbed = Quill.import("blots/block/embed");

const CLIENT_ID = "993793b1d8d3e2e";

/**
 * Customize image so we can add an `id` attribute
 */
class ImageBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute("src", value.url);
    node.setAttribute("id", value.id);
    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute("src"),
      id: node.getAttribute("id")
    };
  }
}

ImageBlot.blotName = "image";
ImageBlot.tagName = "img";
Quill.register(ImageBlot);

export default {
  data: () => ({
    content: "",
    fixText:"",
    text:"",
    array:[],
    msgData:[]
  }),
  async beforeMount(){
    console.log("before mount");
    let data=await axios({ method: "GET", "url": "http://localhost:3000/msgs" })
    console.log("data : ",data.data);
    this.msgData=data.data
  },
  methods: {
    selectText(value){
      console.log("data : ",value);
      this.content=this.fixText+value
    },
    handleTextChange(obj,obj2) {
      let typedText=""
      if(!this.text){
        typedText=""
      }
      if(obj.ops.length==2){
        console.log("in if 1");
        if(Object.keys(obj.ops[1])[0]=="insert"){
          console.log("in if 2");
          typedText=obj2.ops[0].insert.replace("\n","")+obj.ops[1].insert
        }else{
          console.log("in else 1");
          typedText=obj2.ops[0].insert.slice(0,obj2.ops[0].insert.length-2)
        }
      }else{
        if(Object.keys(obj.ops[0])[0]=="insert")
          typedText=obj.ops[0].insert
      }

      console.log("typedText : ",typedText);
      console.log("obj1",obj);
      console.log("obj2",obj2);
      console.log("text",this.text);
      const splitArray=typedText.split(/\.|\?|\,/)
      this.text= splitArray[splitArray.length-1].trimStart()
      this.fixText =typedText.replace(new RegExp(this.text + '$'), '');
      // this.text=splitArray[splitArray.length-1]
      console.log("this.fixText : ",this.fixText );
      console.log("this.content: ",typedText);
      console.log("splitArray : ",splitArray[splitArray.length-1]);

      let arr=[]
      this.array=[]
        console.log("this.text.trim().length>0 this.msgData : ",this.msgData)
      this.msgData.map(item=>{
        if(item.toLowerCase().startsWith(this.text.toLowerCase())){
          arr.push(item)
        }
      })
      console.log("this.text.trim().length>0 : ",arr)
      if(this.text.trim().length>0){
        this.array=arr
      }
    },

    onEditorBlur(quill) {
      console.log("editor blur!----------------------", quill);
    },

    onEditorFocus(quill) {
      console.log("editor focus!", quill);
    },

    deleteImage(id) {
      console.log("content  :  ",this.content);
      console.log("id  :  ",id);
    },

    async handleImageAdded(file, Editor, cursorLocation) {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios({
        url: "https://api.imgur.com/3/image",
        method: "POST",
        headers: { Authorization: "Client-ID " + CLIENT_ID },
        data: formData
      });
      console.log("TCL: handleImageAdded -> data", data);

      const { link, id } = data.data;
      Editor.insertEmbed(
        cursorLocation,
        "image",
        {
          id,
          url: link
        },
        Quill.sources.USER
      );
    },

    handleImageRemoved(image) {
      console.log("handleImageRemoved -> image", image);
      this.deleteImage(image.id);
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

// body {
//   background: #e2e1e0;
//   text-align: center;
// }

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
