import React, { ReactNode } from 'react';
import { ConfigProvider } from 'antd';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => (
  <ConfigProvider
    theme={{
      token: {
        // Seed Token
        colorPrimary: '#00b96b',
        borderRadius: 3,
      },
    }}
  >
    {children}
  </ConfigProvider>
);

export default ThemeProvider;
