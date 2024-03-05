/**
 * format date from string to instance of Date.
 * @param {string} str date string in format: `dd-mm-yyyy`
 * @returns {Date}
 */
const getDateFromString = (str) => {
    if (!str.match(/([0-9]{2})(\-)([0-9]{2})(\-)([0-9]{4})/ig)) {
        throw new Error("invalid date format for `birth_date`");
    }

    const a = str.split("-").map(d => Number(d));

    return new Date(a[2], a[1] - 1, a[0]);
}

const getAgeRangeFromDate = (birth_date) => {
    const age = Math.floor((new Date().getTime() - new Date(birth_date).getTime()) / 3.15576e+10);

    if (age > 0 && age <= 18) {
        return "0-18";
    } else if (age > 18 && age <= 30) {
        return "19-30";
    } else if (age > 30 && age <= 50) {
        return "31-50";
    } else if (age > 50 && age <= 65) {
        return "51-65";
    } else if (age > 65 && age <= 80) {
        return "66-80"; 
    } else {
        return "80+"
    }
}

module.exports = {
    getDateFromString,
    getAgeRangeFromDate
};