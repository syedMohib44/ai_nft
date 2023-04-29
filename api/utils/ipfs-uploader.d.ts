declare module 'ipfs-uploader' {
  function uploadToIPFS(data: Buffer, apiKey: string): Promise<string>;
  export = uploadToIPFS;
}