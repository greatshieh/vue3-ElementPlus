<script>
const route = useRoute()
const router = useRouter()
export default {
  setup() {
    const { params, query } = route
    const { path } = params
    router.replace({ path: '/' + path, query })
    return () => h() // avoid warning message
  }
}
</script>
