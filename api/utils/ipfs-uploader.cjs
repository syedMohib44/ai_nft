/**
 * To make this function run make sure to update node_modules/ipfs-core/package.json 
 *  "exports": {
    ".": "./src/index.js",
    "./config/profiles": {
      "import": "./src/components/config/profiles.js"
    }
  },
 */
const uploadToIPFS = async (data, apiKey) => {
  const IPFS = await import('ipfs-http-client');
  const ipfs = IPFS.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      "Authorization": apiKey
    }
  });
  const result = await ipfs.add(data)
  return result.path;
}


module.exports = { uploadToIPFS };