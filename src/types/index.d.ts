export {};

declare global {
	interface Window {
		$: fn;
		Web3Modal: any;
		WalletConnectProvider: any;
	}
}

// interface ImportMetaEnv {
// 	VITE_INFURAID: string;
// }

// declare module '@components' {}
