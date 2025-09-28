export const authInitialState = {
  token: '',

  user: {
    name: '',
    password: '',
    email: '',
    position: [],
  },

  authenticate: false,
  authenticating: false,
  loading: false,
  error: '',
  message: '',
};