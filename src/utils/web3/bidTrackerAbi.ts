export const bidTrackersAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_usdtToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_marketplaceEOA',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReentrancyGuardReentrantCall',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'AmountReceived',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'AmountSent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'sellerDbId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bidAmountTransfered',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'buyerDbId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'confirmed',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'auctionId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'gameTitleId',
        type: 'string',
      },
    ],
    name: 'AuctionConfirmed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: '_auctionId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'sellerDbId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bidAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'started',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'resulted',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'buyerDbId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'confirmed',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'gameTitleId',
        type: 'string',
      },
    ],
    name: 'PlaceBidFulfilled',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_auctionId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'sellerDbId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'bidAmount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'started',
        type: 'bool',
      },
      {
        internalType: 'string',
        name: 'buyerDbId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'gameTitleId',
        type: 'string',
      },
    ],
    name: 'FulfillBid',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'bidsFulfilled',
    outputs: [
      {
        internalType: 'string',
        name: '_auctionId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'sellerDbId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'bidAmount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'started',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'resulted',
        type: 'bool',
      },
      {
        internalType: 'string',
        name: 'buyerDbId',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'confirmed',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'gameTitleId',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_auctionId',
        type: 'string',
      },
    ],
    name: 'confirmPaidAuction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_auctionId',
        type: 'string',
      },
    ],
    name: 'fetchSingleFulfilledBid',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: '_auctionId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'sellerDbId',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'bidAmount',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'started',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'resulted',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'buyerDbId',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: 'confirmed',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'seller',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'buyer',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'gameTitleId',
            type: 'string',
          },
        ],
        internalType: 'struct BidTracker.BidFulfilled',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_auctionId',
        type: 'string',
      },
    ],
    name: 'setAuctionSellerWallet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
    ],
    name: 'transferOutUSDTToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'usdtToken',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
