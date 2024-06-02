// src/blockchain/blockchain.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import { EventEmitter } from 'events';

@Injectable()
export class BlockchainService extends EventEmitter implements OnModuleInit {
  private provider: ethers.providers.JsonRpcProvider;
  private contractAddress: string;
  private contractABI: any[];
  private pastEvents: any[];

  constructor() {
    super();
    this.provider = new ethers.providers.JsonRpcProvider(
      'https://polygon-amoy.infura.io/v3/4f2c3e18ba5c4f3c8195970a0d38822e',
    );
    this.contractAddress = '0x28a4D1625e7d83FC30672ed84A0aFA6A5a2D80CD';
    this.contractABI = [
      // {
      //   anonymous: false,
      //   inputs: [
      //     {
      //       indexed: true,
      //       internalType: 'address',
      //       name: 'from',
      //       type: 'address',
      //     },
      //     {
      //       indexed: true,
      //       internalType: 'address',
      //       name: 'to',
      //       type: 'address',
      //     },
      //     {
      //       indexed: false,
      //       internalType: 'uint256',
      //       name: 'value',
      //       type: 'uint256',
      //     },
      //   ],
      //   name: 'Transfer',
      //   type: 'event',
      // },
      {
        constant: false,
        inputs: [
          {
            name: '_to',
            type: 'address',
          },
          {
            name: '_tokenId',
            type: 'uint256',
          },
        ],
        name: 'mint',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];
    this.pastEvents = [];
  }

  onModuleInit() {
    this.pollForEvents();
  }

  private async pollForEvents() {
    const pollingInterval = 15000; // 15 seconds
    let lastBlock = await this.provider.getBlockNumber();

    setInterval(async () => {
      try {
        const currentBlock = await this.provider.getBlockNumber();
        console.log(currentBlock);
        if (currentBlock > lastBlock) {
          const logs = await this.getMintEvents(lastBlock + 1, currentBlock);
          console.log(logs);
          logs.forEach((log) => {
            const parsedLog = new ethers.utils.Interface(
              this.contractABI,
            ).parseLog(log);
            const { from, to, value } = parsedLog.args;
            const event = { from, to, value: value.toString(), log };
            console.log(
              `Transfer from ${from} to ${to} of ${value.toString()}`,
            );
            console.log(
              'TXn Length: ' + this.pastEvents.length,
              'Curren Block: ' + currentBlock,
              'Last Block: ' + lastBlock,
            );
            this.pastEvents.push(event);
            this.emit('Mint', event);
          });
          lastBlock = currentBlock;
        }
      } catch (error) {
        console.error('Error polling for events:', error);
      }
    }, pollingInterval);
  }

  private async getTransferEvents(fromBlock: number, toBlock: number) {
    const filter = {
      address: this.contractAddress,
      fromBlock: ethers.utils.hexlify(fromBlock),
      toBlock: ethers.utils.hexlify(toBlock),
      topics: [ethers.utils.id('Transfer(address,address,uint256)')],
    };

    try {
      const logs = await this.provider.send('eth_getLogs', [filter]);
      return logs;
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  }

  private async getMintEvents(fromBlock: number, toBlock: number) {
    const filter = {
      address: this.contractAddress,
      fromBlock: ethers.utils.hexlify(fromBlock),
      toBlock: ethers.utils.hexlify(toBlock),
      topics: [ethers.utils.id('Mint(address,uint256)')],
    };

    try {
      const logs = await this.provider.send('eth_getLogs', [filter]);
      return logs;
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  }

  getPastEvents() {
    return this.pastEvents;
  }
}
