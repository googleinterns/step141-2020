import { cleanup, getByText, render, wait } from '@testing-library/react';
import React from 'react';
import InfoPage from './infopage';

describe('Info page', () => {
  afterEach(() => {
    delete global['fetch'];
    cleanup();
  });

  it('should render successfully', async () => {
    global['fetch'] = jest.fn().mockResolvedValueOnce({
      json: () => ({
        message: 'my message',
      }),
    });

    const { baseElement } = render(<InfoPage />);
    await wait(() => getByText(baseElement, 'my message'));
  });
});
