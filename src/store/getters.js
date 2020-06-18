const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  price: state => state.cart.price,
  permission_routes: state => state.permission.routes,
  size: state => state.app.size
}
export default getters
