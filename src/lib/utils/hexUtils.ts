import { ethers } from 'ethers';

const MIN = 1;
const MAX = 1000000;
const theRandomNumber = Math.floor(Math.random() * (MAX - MIN + 1) + MIN);

// num to bytes32
const hexify = (payload: number) => ethers.utils.hexZeroPad(ethers.utils.hexlify(payload), 32);

// convert num to salt
const createSalt = (num: number) => {
	const salt = ethers.utils.keccak256(ethers.utils.arrayify(num));
	return salt;
};

// function to hash bidders bidvalue - hash of bid value + salt
const hashCommitmentParams = (bidAmount: ethers.BigNumberish, salt: string | number) =>
	ethers.utils.solidityKeccak256(['uint256', 'bytes32'], [bidAmount, salt]);

// utility to test matching bid commitment hashes
const unveilHashCommitment = (bidder: string, bidCommitment: string, bidToken: string) =>
	ethers.utils.solidityKeccak256(
		['address', 'bytes32', 'address'],
		[bidder, bidCommitment, bidToken]
	);

const ZERO_BYTES_32 = hexify(0);

export {
	hexify,
	hashCommitmentParams,
	createSalt,
	ZERO_BYTES_32,
	unveilHashCommitment,
	theRandomNumber
};
