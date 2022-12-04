const svgPath = (name: string) => {
	return `/icons/${name}.svg`;
};

const ipfsJSONParser = (ipfsURL: string) => {
	return `https://ipfs.io/${ipfsURL.replaceAll('ipfs://', 'ipfs/')}`
}

export { svgPath, ipfsJSONParser };
