const combineDateTime = (date: string, time: string) => {
	time = time + ':00';
	const dateObj = new Date(date + ' ' + time);
	return dateObj;
};

// Date -> UNIX
const datetoUnix = (date: Date) => {
	return Math.ceil(date.getTime() / 1000);
};

// mins -> UNIX seconds
const minsToUnix = (mins: number) => {
	return mins * 60;
};

// UNIX -> Date
const unixToDate = (unixDate: number) => {
	console.log(unixDate);
	const dateTime = new Date(unixDate * 1000);
	return dateTime.toISOString();
};

export { combineDateTime, datetoUnix, unixToDate, minsToUnix };
