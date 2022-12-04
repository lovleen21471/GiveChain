import { browser } from '$app/environment';
import type { Auction } from '$lib/interfaces';
import { writable } from 'svelte/store';

export const web3Modal = writable<any>(null);

export const currentAuction = writable<Auction | null>(null);

export const nftToAuction = writable<any>(null);

export const NEW_AUCTION_CHANGES = writable<boolean>(false);

// export const AVAILABLE_AUCTIONS = writable<Auction[]>([]);

const auctionJson: string = (browser && localStorage.getItem('AVAILABLE_AUCTIONS')) || '';
export const AVAILABLE_AUCTIONS = writable<Auction[]>(
	(auctionJson !== '' && JSON.parse(auctionJson)) || []
);
AVAILABLE_AUCTIONS.subscribe(
	(value) => browser && (localStorage.AVAILABLE_AUCTIONS = JSON.stringify(value))
);

const userNFTsJson: string = (browser && localStorage.getItem('USER_NFTS')) || '';
export const USER_NFTS = writable<any[]>((userNFTsJson !== '' && JSON.parse(userNFTsJson)) || []);
USER_NFTS.subscribe((value) => browser && (localStorage.USER_NFTS = JSON.stringify(value)));
