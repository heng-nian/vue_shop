import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

  ; !function (...arr) {
    arr.forEach(assembly => Vue.use(assembly))
  }(Button, Form, FormItem, Input);
Vue.component(Message.name, Message)
Vue.prototype.$message = Message