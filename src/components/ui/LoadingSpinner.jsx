function LoadingSpinner({ fullPage = false }) {
  if (fullPage) {
    return (
      <div className="loading-fullpage">
        <div className="spinner" />
        <p>Memuat...</p>
      </div>
    );
  }
  return <div className="spinner spinner--small" />;
}

export default LoadingSpinner;
