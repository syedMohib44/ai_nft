/**
 * To make this function run make sure to update node_modules/ipfs-core/package.json 
 *  "exports": {
    ".": "./src/index.js",
    "./config/profiles": {
      "import": "./src/components/config/profiles.js"
    }
  },
 */
const uploadToIPFS = async (data) => {
    const IPFS = await import('ipfs-core');
    const ipfs = await IPFS.create();
    const result = await ipfs.add(data)
    ipfs.stop();
    return result.cid;
}


module.exports = { uploadToIPFS };