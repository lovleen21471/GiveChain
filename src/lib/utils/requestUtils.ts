import { browser } from '$app/environment';

export const browserGet = (key: string): string | null => {
	if (browser) {
		const item = localStorage.getItem(key);
		if (item) {
			return item;
		}
	}
	return null;
};

export const browserSet = (key: string, value: any): void => {
	if (browser) {
		localStorage.setItem(key, value);
	}
};
