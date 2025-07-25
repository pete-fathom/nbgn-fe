// DBGN Token Contract ABI
export const DBGN_ABI = [
  // ERC-20 Standard Functions
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',

  // DBGN Specific Functions (for USDC operations)
  'function mint(uint256 _usdcAmount) returns (uint256)',
  'function redeem(uint256 _dbgnAmount) returns (uint256)',
  'function calculateDBGN(uint256 _usdcAmount) pure returns (uint256)',
  'function calculateUSDC(uint256 _dbgnAmount) pure returns (uint256)',
] as const;

export default DBGN_ABI;
