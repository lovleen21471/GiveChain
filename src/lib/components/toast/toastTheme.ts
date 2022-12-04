import { toast } from '@zerodevx/svelte-toast';

export const successToast = (m: string) =>
	toast.push(m, {
		theme: {
			'--toastBackground': 'green',
			'--toastColor': 'white',
			'--toastBarBackground': '#d3f85a'
		}
	});

export const warningToast = (m: string) =>
	toast.push(m, {
		theme: {
			'--toastBackground': 'orange',
			'--toastColor': 'white',
			'--toastBarBackground': '#d3f85a'
		}
	});

export const errorToast = (m: string) =>
	toast.push(m, {
		theme: {
			'--toastBackground': 'red',
			'--toastColor': 'white',
			'--toastBarBackground': '#d3f85a'
		}
	});
