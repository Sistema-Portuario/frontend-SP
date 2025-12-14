export const authInitialState = {
  token: '',

  user: {
    name: '',
    password: '',
    email: '',
    role: 'employee',
    position: 'truckDriver',
  },

  authenticate: true,
  authenticating: false,
  loading: false,
  error: '',
  message: '',
};