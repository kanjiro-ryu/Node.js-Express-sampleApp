exports.date2ISOS = function (dateStr) {
    var dateObj = new Date(dateStr);
    if (!dateObj || dateObj.toString() === 'Invalid Date') {
        return '';
    }
    return dateObj.toISOString().substr(0,19);
}