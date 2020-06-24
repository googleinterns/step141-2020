import React from 'react';
import { render } from '@testing-library/react';

import Header from './header';

describe(' Components', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Header title="HELLO!" />);
    expect(baseElement).toBeTruthy();
  });
});
