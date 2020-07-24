import NavHeader from '@/components/NavHeader'
import NavBreadcrumb from '@/components/NavBreadcrumb'
import NavFooter from '@/components/NavFooter'
import Modal from '@/components/Modal'

function plugins(Vue){
  Vue.component('NavHeader',NavHeader)
  Vue.component('NavBreadcrumb',NavBreadcrumb)
  Vue.component('NavFooter',NavFooter)
  Vue.component('Modal',Modal)
}
export default plugins