<script name="MenuItem">
import SvgIcon from '@/components/SvgIcon/index.vue'
export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const vnodes = []
    if (props.icon) {
      vnodes.push(h(SvgIcon, { 'icon-class': `${props.icon}` }))
    }

    if (props.title) {
      vnodes.push(h('span', { slot: 'title' }, `${props.title}`))
    }

    return () => vnodes
  }
}
</script>
