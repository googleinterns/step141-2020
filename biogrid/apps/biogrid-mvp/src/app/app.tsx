import React, { useEffect, useState } from 'react';
import { Message } from '@biogrid/api-interfaces';
import { InputPage } from './pages/input-page'

export const App = () => {
  const [m, setMessage] = useState<Message>({ message: '' });

  useEffect(() => {
    fetch('/api')
      .then((r) => r.json())
      .then(setMessage);
  }, []);

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h1>Welcome to biogrid-mvp!</h1>
        <InputPage />
      </div>
      <div>{m.message}</div>
    </>
  );
};

export default App;
