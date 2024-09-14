export const paymentAbi = [
  'function approvePayment(uint256 _amount) public',
  'function payForGame(string _sellerPublicEmail, string _orderRef, string[] _gameId, uint256 _amount) public',
  'function getTransaction(uint256 _index) public view returns (address, string, string, uint256, string[], uint256)',
  'function getTransactionByOrderRef(string _orderRef) public view returns (address, string, string, uint256, string[], uint256)',
  'function getTransactionCount() public view returns (uint256)',
  'event PaymentMade(address indexed buyer, uint256 amount, string[] gameId, uint256 timestamp)',
  'event PaymentApproval(address indexed buyer, address indexed approvee, uint256 amount, uint256 timestamp)',
];
