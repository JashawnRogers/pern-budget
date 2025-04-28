export const getDate = () => {
    const date = new Date();
    let month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    switch (month) {
        case 0:
            month = 'January';
        break;
        case 1:
            month ='February';
        break;
        case 2:
            month = 'March';
        break;
        case 3:
            month ='April';
        break;
        case 4:
            month = 'May';
        case 5:
            month = 'June'
        break;
        case 6:
            month = 'July'
        break;
        case 7:
            month = 'August';
        break;
        case 8:
            month = 'September';
        break;
        case 9:
            month = 'October';
        break;
        case 10:
            month = 'November';
        break;
        case 11:
            month = 'December';
        break;
        default:
            month = 'ERROR...'
    }

   return `${month} ${day}, ${year}`;
}