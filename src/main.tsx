import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ThemeProvider from './theme/themeProvider.tsx'
import { MyContextProvider } from './context/context.provider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MyContextProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  </MyContextProvider>
)
