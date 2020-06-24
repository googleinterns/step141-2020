import React from 'react';

import './header.css';

export interface ComponentsProps {
  title: string;
}

export const Components = (props: ComponentsProps) => {
  return (
    <div>
      <h1>Welcome to components: {props.title}</h1>
    </div>
  );
};

export default Components;
