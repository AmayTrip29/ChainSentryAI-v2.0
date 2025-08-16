
import { Audit, Severity } from './types';

export const DEMO_AUDITS: Audit[] = [
  {
    id: 'audit-001',
    repo_url: 'github.com/example/erc20-contract',
    chain: 'Ethereum',
    status: 'Completed',
    started_at: '2023-10-27T10:00:00Z',
    finished_at: '2023-10-27T10:02:30Z',
    commit_sha: 'a1b2c3d',
    summary: {
      [Severity.Critical]: 1,
      [Severity.High]: 2,
      [Severity.Medium]: 1,
      [Severity.Low]: 0,
      [Severity.Informational]: 3,
    },
    files: [
      { id: 'file-01', path: 'contracts/Token.sol', sha256: '...', language: 'Solidity', findings_count: 4 },
      { id: 'file-02', path: 'contracts/SafeMath.sol', sha256: '...', language: 'Solidity', findings_count: 0 },
    ],
    findings: [
      {
        id: 'finding-001',
        type: 'Reentrancy',
        severity: Severity.Critical,
        cvss: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        confidence: 'High',
        file_path: 'contracts/Token.sol',
        start_line: 42,
        end_line: 45,
        description: 'A reentrancy vulnerability exists in the withdraw function, allowing an attacker to repeatedly withdraw funds before the user balance is updated.',
        ai_explanation: 'The core issue is that the user\'s balance is updated *after* an external call (`msg.sender.call{value: amount}("")`). An attacker using a fallback function in their contract can re-enter the `withdraw` function multiple times, passing the balance check each time, before the balance is set to zero, thus draining the contract\'s funds.',
        vulnerable_code: `
function withdraw(uint256 amount) public {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed.");

    balances[msg.sender] -= amount;
}`,
        ai_patch_diff: `
-   (bool success, ) = msg.sender.call{value: amount}("");
-   require(success, "Transfer failed.");
-   balances[msg.sender] -= amount;
+   balances[msg.sender] -= amount;
+   (bool success, ) = msg.sender.call{value: amount}("");
+   require(success, "Transfer failed.");`,
        swc_id: 'SWC-107',
        trace_data: [
          { name: 'Initial Call', source: 1, sink: 2 },
          { name: 'External Call', source: 2, sink: 3 },
          { name: 'Re-entrant Call', source: 3, sink: 2 },
          { name: 'State Update', source: 2, sink: 4 },
        ]
      },
      {
        id: 'finding-002',
        type: 'Integer Overflow',
        severity: Severity.High,
        cvss: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:H',
        confidence: 'High',
        file_path: 'contracts/Token.sol',
        start_line: 88,
        end_line: 88,
        description: 'An integer overflow can occur in the `transfer` function when adding to a recipient\'s balance if `SafeMath` is not used.',
        ai_explanation: 'The line `balances[recipient] += amount;` does not use a safe math library. If `balances[recipient]` is close to the maximum value of a `uint256` and a large `amount` is added, the value will wrap around to zero, effectively destroying the recipient\'s funds and creating tokens out of thin air from the sender\'s perspective.',
        vulnerable_code: `
function transfer(address recipient, uint256 amount) public {
    // ... checks
    balances[msg.sender] -= amount;
    balances[recipient] += amount;
}`,
        ai_patch_diff: `
-   balances[recipient] += amount;
+   balances[recipient] = balances[recipient].add(amount);`,
        swc_id: 'SWC-101',
      }
    ],
  },
  {
    id: 'audit-002',
    repo_url: 'github.com/example/anchor-lending',
    chain: 'Solana',
    status: 'Completed',
    started_at: '2023-10-26T14:00:00Z',
    finished_at: '2023-10-26T14:05:10Z',
    commit_sha: 'e4f5g6h',
    summary: {
      [Severity.Critical]: 0,
      [Severity.High]: 1,
      [Severity.Medium]: 3,
      [Severity.Low]: 1,
      [Severity.Informational]: 1,
    },
    files: [
       { id: 'file-03', path: 'programs/lending/src/lib.rs', sha256: '...', language: 'Rust', findings_count: 5 },
    ],
    findings: [
      {
        id: 'finding-003',
        type: 'Missing Signer Check',
        severity: Severity.High,
        cvss: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N',
        confidence: 'High',
        file_path: 'programs/lending/src/lib.rs',
        start_line: 112,
        end_line: 112,
        description: 'The `update_authority` instruction is missing a signer check on the new authority account, allowing anyone to set themselves as the new authority.',
        ai_explanation: 'In the `UpdateParams` struct, the `new_authority` account is defined as an `AccountInfo` but lacks the `#[account(signer)]` constraint. This means any account can be passed in this field, and the program will not verify if that account signed the transaction. An attacker can call this instruction and pass their own public key as the `new_authority`, taking control of the program\'s parameters.',
        vulnerable_code: `
#[derive(Accounts)]
pub struct UpdateParams<'info> {
    #[account(mut, has_one = authority)]
    pub params: Account<'info, Params>,
    pub authority: AccountInfo<'info>,
    /// CHECK: This should be a signer
    pub new_authority: AccountInfo<'info>,
}`,
        ai_patch_diff: `
-   pub new_authority: AccountInfo<'info>,
+   #[account(signer)]
+   pub new_authority: AccountInfo<'info>,`,
      }
    ]
  }
];
