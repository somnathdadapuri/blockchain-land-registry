import confetti from 'canvas-confetti';

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address === '0x0000000000000000000000000000000000000000') return '0x00...0000 (Genesis)';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function formatEth(val?: number): string {
  if (val === undefined || val === null) return '0.00 ETH';
  return `${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ETH`;
}

export function formatUsd(ethVal?: number, ethPrice = 2850): string {
  if (ethVal === undefined || ethVal === null) return '$0.00';
  return `$${(ethVal * ethPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function formatDate(timestamp: number): string {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B00', '#F97316', '#FBBF24', '#10B981', '#3B82F6'],
    });
  } catch (e) {
    // Ignore if blocked
  }
}

export function generateIpfsCid(contentSummary: string): string {
  let hashNum = 0;
  for (let i = 0; i < contentSummary.length; i++) {
    hashNum = (hashNum << 5) - hashNum + contentSummary.charCodeAt(i);
    hashNum |= 0;
  }
  const base58chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = 'Qm';
  let seed = Math.abs(hashNum) + Date.now();
  for (let i = 0; i < 44; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    result += base58chars[seed % base58chars.length];
  }
  return result;
}
