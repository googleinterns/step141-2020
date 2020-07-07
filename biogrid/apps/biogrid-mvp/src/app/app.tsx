import React, { useEffect  } from 'react';
import { InputPage } from './pages/input-page';

export const App = () => {
  useEffect(() => {
    fetch('/api').then((r) => r.json());
  }, []);

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h1>Welcome to biogrid-mvp!</h1>
        <InputPage />
      </div>
    </>
  );
};

export default App;
