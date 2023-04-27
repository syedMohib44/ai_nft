declare module 'ipfs-uploader' {
  function uploadToIPFS(data: Buffer): Promise<string>;
  export = uploadToIPFS;
}