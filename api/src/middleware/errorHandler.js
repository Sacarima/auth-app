export function errorHandler(err, req, res, next) {
  const status = err.status || err.code || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error('[error]', err);
  }

  res.status(Number(status)).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  });
}

export function notFound(req, res) {
  res.status(404).json({ error: 'Not Found' });
}