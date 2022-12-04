import { redirect } from '@sveltejs/kit';

export function load({ params }: any) {
	if (params.tokenId) {
		return { tokenId: params.tokenId };
	}

	throw redirect(302, '/explore');
}
