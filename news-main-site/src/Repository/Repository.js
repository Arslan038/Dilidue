import axios from 'axios';

const baseURL = 'http://localhost:5000/api/';
let token = null;
const user = JSON.parse(localStorage.getItem('dilidueUser'));
if (user) {
  token = user.token;
}
export default axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token ? token : ''}`,
  },
});
