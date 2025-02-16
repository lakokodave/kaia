// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreatorsHub is ERC721URIStorage, Ownable {
    IERC20 public kaiaToken;
    IERC20 public ethToken;
    IERC20 public polygonToken;
    IERC20 public bscToken;
    
    uint256 public nextTokenId;
    
    struct Content {
        address creator;
        string ipfsHash;
        uint256 price;
        bool isNFT;
    }
    
    mapping(uint256 => Content) public contents;
    mapping(address => bool) public subscribers;
    mapping(address => uint256) public subscriptionExpiry;
    
    event ContentUploaded(uint256 indexed contentId, address indexed creator, string ipfsHash, uint256 price);
    event Subscribed(address indexed user, uint256 expiry);
    event Tipped(address indexed fan, address indexed creator, uint256 amount);
    event NFTMinted(uint256 indexed tokenId, address indexed creator, string tokenURI);
    
    constructor(address _kaiaToken, address _ethToken, address _polygonToken, address _bscToken) ERC721("CreatorsHubNFT", "CHNFT") {
        kaiaToken = IERC20(_kaiaToken);
        ethToken = IERC20(_ethToken);
        polygonToken = IERC20(_polygonToken);
        bscToken = IERC20(_bscToken);
    }
    
    function uploadContent(string memory _ipfsHash, uint256 _price, bool _isNFT) external {
        contents[nextTokenId] = Content(msg.sender, _ipfsHash, _price, _isNFT);
        emit ContentUploaded(nextTokenId, msg.sender, _ipfsHash, _price);
        nextTokenId++;
    }
    
    function subscribe(uint256 _duration, uint256 _price, address _token) external {
        require(IERC20(_token).transferFrom(msg.sender, address(this), _price), "Payment failed");
        subscriptionExpiry[msg.sender] = block.timestamp + _duration;
        subscribers[msg.sender] = true;
        emit Subscribed(msg.sender, subscriptionExpiry[msg.sender]);
    }
    
    function tipCreator(address _creator, uint256 _amount, address _token) external {
        require(IERC20(_token).transferFrom(msg.sender, _creator, _amount), "Tip failed");
        emit Tipped(msg.sender, _creator, _amount);
    }
    
    function mintNFT(string memory _tokenURI) external {
        _safeMint(msg.sender, nextTokenId);
        _setTokenURI(nextTokenId, _tokenURI);
        emit NFTMinted(nextTokenId, msg.sender, _tokenURI);
        nextTokenId++;
    }
}
