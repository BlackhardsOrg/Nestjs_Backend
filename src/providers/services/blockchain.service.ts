// src/blockchain/blockchain.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import { EventEmitter } from 'events';
import { paymentAbi } from 'src/utils/web3/paymentAbi';

@Injectable()
export class BlockchainService extends EventEmitter {
  private provider: ethers.providers.JsonRpcProvider;
  private paymentAbi: any[];

  private contract: ethers.Contract;
  private signer: ethers.Wallet;

  // Replace with your contract address and deployed network RPC
  private readonly paymentContractAddress =
    '0xfE1A96c945c970e3d9cE1788A0E42d64Aa29b7be';

  constructor() {
    super();

    // Connect to your RPC (like Infura or Enugu chain RPC)
    this.provider = new ethers.providers.JsonRpcProvider(
      'https://enugu-rpc.assetchain.org',
    );

    // Use the private key of your wallet for signing transactions
    // const privateKey = 'YOUR_PRIVATE_KEY'; // Make sure to keep this safe in environment variables
    // this.signer = new ethers.Wallet(privateKey, this.provider);
    this.paymentAbi = paymentAbi;
    // Initialize the contract instance
    this.contract = new ethers.Contract(
      this.paymentContractAddress,
      this.paymentAbi,
      this.provider,
    );
  }

  // Get Transaction by Index
  async getTransactionByOrderRef(orderRef: string): Promise<any> {
    try {
      const transaction =
        await this.contract.getTransactionByOrderRef(orderRef);
      console.log(transaction, 'TRANSACTION ');
      return transaction;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw new Error('Failed to get transaction');
    }
  }

  // Get Total Transaction Count
  async getTransactionCount(): Promise<number> {
    try {
      const count = await this.contract.getTransactionCount();
      return count;
    } catch (error) {
      console.error('Error fetching transaction count:', error);
      throw new Error('Failed to get transaction count');
    }
  }
}
