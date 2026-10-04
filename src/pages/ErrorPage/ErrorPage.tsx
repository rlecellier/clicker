import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

export const ErrorPage = () => {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong.';

  return (
    <main>
      <h1>{message}</h1>
      <Link to="/">Back to the game</Link>
    </main>
  );
};
