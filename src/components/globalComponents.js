import NavHeader from '@/components/NavHeader'
import NavBreadcrumb from '@/components/NavBreadcrumb'
import NavFooter from '@/components/NavFooter'

function plugins(Vue){
  Vue.component('NavHeader',NavHeader)
  Vue.component('NavBreadcrumb',NavBreadcrumb)
  Vue.component('NavFooter',NavFooter)
}
export default plugins