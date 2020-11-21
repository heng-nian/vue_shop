import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message,
  Container, Header, Aside, Main,
  Menu, Submenu, MenuItem, MenuItemGroup,
  Breadcrumb, BreadcrumbItem, Card, Row, Col,
  Table, TableColumn, Switch, Tooltip, Pagination,
  Dialog, MessageBox
} from 'element-ui'

  ; !function (...arr) {
    arr.forEach(assembly => Vue.use(assembly))
  }(Button, Form, FormItem, Input,
    Container, Header, Aside, Main,
    Menu, Submenu, MenuItem, MenuItemGroup,
    Breadcrumb, BreadcrumbItem, Card, Row, Col,
    Table, TableColumn, Switch, Tooltip, Pagination,
    Dialog);
Vue.component(Message.name, Message);
Vue.prototype.$message = Message
Vue.component(MessageBox.name, MessageBox);
Vue.prototype.$confirm = MessageBox.confirm 