// frontend/src/services/Ipfs.js
import ipfs from 'ipfs-http-client';

const ipfsClient = ipfs({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

class Ipfs {
  async addFile(file) {
    const added = await ipfsClient.add(file);
    return added.path;
  }

  async getFile(cid) {
    const file = await ipfsClient.get(cid);
    return file;
  }

  async pinFile(cid) {
    await ipfsClient.pin.add(cid);
  }

  async unpinFile(cid) {
    await ipfsClient.pin.rm(cid);
  }
}

export default new Ipfs();