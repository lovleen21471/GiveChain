export const arrayIsNotEqual = (arr1: any[], arr2: any[]) => {
	if ((Array.isArray(arr1) && arr1.join()) !== (Array.isArray(arr2) && arr2.join())) {
		return true;
	}
	return false;
};

export const arrayEquals = (a: any[], b: any[]) => {
	return (
		Array.isArray(a) &&
		Array.isArray(b) &&
		a.length === b.length &&
		a.every((val, index) => val === b[index])
	);
};

export const sortArrayofObjects = (array: any, key: any) => {
	return array.sort((a: any, b: any) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
};

export const scrollIntoView = (el: HTMLDivElement, top: number) => {
	if (!el) return;
	// el.scrollIntoView({
	// 	behavior: 'smooth'
	// });
	// el.scrollIntoView(false);
	// const y = el.getBoundingClientRect().top + window.scrollY;
	window.scroll({
		top: top,
		behavior: 'smooth'
	});
};
