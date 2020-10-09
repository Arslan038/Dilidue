export default {
  methods: {
    getUser() {
      const user = JSON.parse(localStorage.getItem('dilidueUser'));
      if (user) {
        return user;
      }
      return null;
    },
    removeUser() {
      const user = JSON.parse(localStorage.getItem('dilidueUser'));
      if (user) {
        localStorage.removeItem('dilidueUser');
      }
    },
    getDate(d) {
      let months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      let date = String(d);
      if (date.includes('T')) {
        let getMonth = date.split('T')[0].split('-')[1];
        let getDay = date.split('T')[0].split('-')[2];
        let getYear = date.split('T')[0].split('-')[0];
        return months[getMonth - 1] + ' ' + getDay + ', ' + getYear;
      } else {
        let getMonth = date.split('-')[0];
        let getDay = date.split('-')[1];
        let getYear = date.split('-')[2];
        return months[getMonth - 1] + ' ' + getDay + ', ' + getYear;
      }
    },
  },
};
