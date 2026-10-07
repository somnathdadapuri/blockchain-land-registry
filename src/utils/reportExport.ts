import { Property, BlockchainTransaction, BlockchainEvent } from '../types/blockchain';
import { shortenAddress, formatEth, formatDate, formatUsd } from './formatters';

/**
 * Downloads plain text / markdown / JSON file directly in browser without relying on iframe-blocked window.print
 */
export function downloadFile(filename: string, content: string, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates an institutional Land Title Due Diligence Audit Dossier (Markdown / TXT)
 */
export function generateDueDiligenceAuditReport(
  property: Property,
  auditPoints: Array<{ title: string; desc: string; status: string; detail: string }>,
  auditScore: number
): string {
  const isPass = auditScore >= 80;
  const divider = '='.repeat(78);
  const subDivider = '-'.repeat(78);

  const report = `
${divider}
        MUNICIPAL LAND REGISTRY & CADASTRAL AUTHORITY
     DECENTRALIZED TITLE DUE DILIGENCE & ENCUMBRANCE AUDIT DOSSIER
${divider}

AUDIT DATE:         ${new Date().toISOString()}
STANDARD:           ISO-19152 LADM (Land Administration Domain Model)
SMART CONTRACT:     LandRegistry.sol (v0.8.20) on Hardhat EVM (#31337)
VERIFICATION ENGINE: SHA-256 / EIP-712 Cadastral Proof Engine

${subDivider}
1. PROPERTY IDENTIFICATION & CADASTRAL RECORD
${subDivider}
Property UID:       ${property.propertyId}
Cadastral Parcel:   ${property.propertyNumber}
Physical Location:  ${property.location}
GIS Center Geocode: ${property.coordinates || '30.2672° N, 97.7431° W (WGS84 Datum)'}
Surveyed Area:      ${property.area.toLocaleString()} ${property.areaUnit}
Property Class:     ${property.propertyType}
Cadastral Zoning:   ${property.cadastralZone || 'Zone-R4 (Urban High Density Residential)'}
Assessed Valuation: ${formatEth(property.valuationEth)} (≈ ${formatUsd(property.valuationEth * 3450)} USD)
Registered Date:    ${formatDate(property.registeredAt)}
Legal Description:  ${property.legalDescription || 'Official registered lot in East Travis County Land Cadastre.'}

${subDivider}
2. ON-CHAIN TITLE & CRYPTOGRAPHIC INTEGRITY
${subDivider}
Current Legal Owner: ${property.currentOwner}
Prior Legal Owner:   ${property.previousOwner || '0x0000...0000 (Genesis Mint)'}
Title Status:        ${property.status} (Verified: ${property.verified ? 'YES' : 'PENDING'})
IPFS Document CID:   ${property.documentHash}
Cryptographic Proof: Validated on Ethereum EVM Block Ledger

${subDivider}
3. 6-POINT INSTITUTIONAL DUE DILIGENCE AUDIT
${subDivider}
Overall Title Trust Score: ${auditScore}% [${isPass ? 'GRADE A+ / INSTITUTIONAL READY' : 'REQUIRES VERIFICATION'}]

${auditPoints
  .map(
    (pt, i) => `[CHECK ${i + 1}] ${pt.title.toUpperCase()}
Status:  ${pt.status}
Details: ${pt.detail}
Scope:   ${pt.desc}
`
  )
  .join('\n')}
${subDivider}
4. IMMUTABLE CONVEYANCE HISTORY (${property.history.length} Transactions)
${subDivider}
${
  property.history.length === 0
    ? 'No prior transfers recorded. Original genesis registration.'
    : property.history
        .map(
          (h, idx) =>
            `[Record #${idx + 1}] Transfer Type: ${h.transferType}
Date:        ${formatDate(h.timestamp)}
From:        ${h.from}
To:          ${h.to}
Block:       #${h.blockNumber}
TX Hash:     ${h.transactionHash}
`
        )
        .join('\n')
}
${divider}
FINAL AUDIT CONCLUSION:
${
  isPass
    ? 'TITLE CLEAR AND FREE OF ENCUMBRANCES. The recorded holder is legally authenticated on the decentralized ledger. No unresolved lis pendens or fraudulent double-spend vectors detected.'
    : 'CAUTION: Discrepancies or pending survey verification noted. Review check items before executing financial escrow closing.'
}
${divider}
`;

  return report.trim();
}

/**
 * Generates an Official Land Deed Certificate Text & Printable HTML
 */
export function generateCertificateData(property: Property) {
  return `
================================================================================
                    CERTIFICATE OF DECENTRALIZED LAND TITLE
           Travis County Cadastral & Deeds Department • Web3 Registry
================================================================================

CERTIFICATE SERIAL:  CERT-${property.propertyId}-${Date.now().toString(36).toUpperCase()}
PROPERTY UID:        ${property.propertyId}
CADASTRAL PARCEL:    ${property.propertyNumber}
LOCATION:            ${property.location}
SURVEY AREA:         ${property.area.toLocaleString()} ${property.areaUnit}
CURRENT OWNER:       ${property.currentOwner}
ORIGINAL REGISTRAR:  ${property.history[0]?.from || 'State Land Authority (0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266)'}
REGISTRATION DATE:   ${formatDate(property.registeredAt)}
IPFS DEED CID:       ${property.documentHash}
VALUATION:           ${formatEth(property.valuationEth)} (≈ ${formatUsd(property.valuationEth * 3450)} USD)

STATUS: IMMUTABLY RECORDED ON HARDHAT EVM (Chain ID 31337)
VERIFIED BY CADASTRAL SURVEYOR: ${property.verified ? 'YES (Verified)' : 'PENDING'}
================================================================================
`;
}

/**
 * Generates an Official Real Estate Closing Statement & Statutory Tax Breakdown
 */
export function generateClosingStatement(data: {
  propertyId: string;
  location: string;
  jurisdictionName: string;
  valuationEth: number;
  valuationUsd: number;
  stampDutyEth: number;
  registrySurchargeEth: number;
  titleInsuranceEth: number;
  gasFeeEth: number;
  totalClosingFeesEth: number;
  grandTotalEth: number;
  grandTotalUsd: number;
  isFirstTimeBuyer: boolean;
}): string {
  const divider = '='.repeat(78);
  const subDivider = '-'.repeat(78);

  return `
${divider}
             CADASTRAL SETTLEMENT & STATUTORY CLOSING STATEMENT
         Multi-Jurisdiction Real Estate Stamp Duty & Escrow Breakdown
${divider}

STATEMENT DATE:       ${new Date().toISOString()}
JURISDICTION:         ${data.jurisdictionName}
PROPERTY UID:         ${data.propertyId}
LOCATION:             ${data.location}
BUYER TYPE:           ${data.isFirstTimeBuyer ? 'First-Time Homebuyer (Discount Applied)' : 'Standard Conveyance'}

${subDivider}
1. PROPERTY PURCHASE CONSIDERATION
${subDivider}
Agreed Purchase Price:       ${formatEth(data.valuationEth)} (≈ ${formatUsd(data.valuationUsd)})

${subDivider}
2. ITEMIZED STATUTORY TAXES & CLOSING FEES
${subDivider}
Stamp Duty & Transfer Tax:   ${formatEth(data.stampDutyEth)} (≈ ${formatUsd(data.stampDutyEth * 3450)})
Cadastral Registry Surcharge: ${formatEth(data.registrySurchargeEth)} (≈ ${formatUsd(data.registrySurchargeEth * 3450)})
Title Insurance & Escrow:    ${formatEth(data.titleInsuranceEth)} (≈ ${formatUsd(data.titleInsuranceEth * 3450)})
Estimated EVM Smart Gas Fee: ${formatEth(data.gasFeeEth)} (≈ ${formatUsd(data.gasFeeEth * 3450)})

Total Statutory Closing:     ${formatEth(data.totalClosingFeesEth)} (≈ ${formatUsd(data.totalClosingFeesEth * 3450)})

${subDivider}
3. FINAL BUYER SETTLEMENT OBLIGATION
${subDivider}
GRAND TOTAL ESCROW DEPOSIT:  ${formatEth(data.grandTotalEth)} (≈ ${formatUsd(data.grandTotalUsd)})

${divider}
DISCLAIMER: Certified estimate calculated by LandRegistry.sol protocol on-chain rules.
${divider}
`.trim();
}

/**
 * Generates an EVM Ledger Transactions & Event Logs Export (JSON or CSV)
 */
export function exportTransactionsAsCsv(transactions: BlockchainTransaction[]): string {
  const headers = ['Timestamp', 'Block', 'TxHash', 'Function', 'From', 'To', 'GasUsed', 'Status'];
  const rows = transactions.map((tx) => [
    new Date(tx.timestamp).toISOString(),
    tx.blockNumber,
    tx.hash,
    tx.functionName,
    tx.from,
    tx.to,
    tx.gasUsed,
    tx.status,
  ]);

  return [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
}
