export interface AuctionDummy {
	auctionStatus: string;
	bidders: string[];
	bidders_?: any[];
	endTime: number;
	image: string;
	minBidPrice: string;
	owner: string;
	revealDuration: number;
	startTime: number;
	tokenId: number;
	liked: boolean;
}

export interface Auction {
	id: number;
	profile_name: string;
	profile_desc: string;
	profile_pic: string;
	nft: string;
	crypto_price: number;
	usd_price: number;
	liked: boolean;
	bids?: number;
}
