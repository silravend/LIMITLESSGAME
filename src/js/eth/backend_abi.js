const abi = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "reveal",
          "type": "uint256"
        }
      ],
      "name": "getCommit",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "commitLastBlock",
          "type": "uint256"
        },
        {
          "name": "commit",
          "type": "uint256"
        }
      ],
      "name": "getSignatureHash",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "reveal",
          "type": "uint256"
        },
        {
          "name": "blockHash",
          "type": "bytes32"
        }
      ],
      "name": "getInfo",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        },
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
    }
  ]

export default abi;
