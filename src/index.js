import Quill from "quill";
import VueEditor from "@/components/VueEditor.vue";
import Selector from "@/components/Selector.vue";
import Title from "@/components/Title.vue";

const version = "__VERSION__";

// Declare install function executed by Vue.use()
export function install(Vue) {
  if (install.installed) return;
  install.installed = true;

  Vue.component("VueEditor", VueEditor);
  Vue.component("Selector", Selector);
  Vue.component("Title", Title);
}

const VPlugin = {
  install,
  version,
  Quill,
  VueEditor,
  Selector,
  Title,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(VPlugin);
}

export default VPlugin;
export { VueEditor, Quill, Selector, Title };

/*************************************************/
