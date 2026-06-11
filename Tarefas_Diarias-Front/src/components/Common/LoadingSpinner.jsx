export const LoadingSpinner = ({ size = 32 }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
    <div className="loading-spinner" style={{ width: size, height: size }} />
  </div>
);
