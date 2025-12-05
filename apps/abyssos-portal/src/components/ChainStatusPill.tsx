import { useChainStatus } from '../hooks/useChainStatus';

export function ChainStatusPill() {
  const { status, retry } = useChainStatus();

  let label = 'Connecting to Demiurge…';
  let className = 'abyss-pill abyss-pill--connecting';
  let onClick: (() => void) | undefined = undefined;

  if (status.state === 'connected') {
    label = `Demiurge · height ${status.height}`;
    className = 'abyss-pill abyss-pill--online';
  } else if (status.state === 'error') {
    label = 'RPC Error (tap to retry)';
    className = 'abyss-pill abyss-pill--offline';
    onClick = retry;
  }

  return (
    <div className={className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <span className="abyss-pill-dot" />
      <span className="abyss-pill-text">{label}</span>
    </div>
  );
}
