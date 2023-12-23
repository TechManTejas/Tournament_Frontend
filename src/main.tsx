import ReactDOM from 'react-dom/client'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import App from './App.tsx'
import './index.css'
import ThemeProvider from './theme/themeProvider.tsx'
import { MyContextProvider } from './context/context.provider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MyContextProvider>
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </ThemeProvider>,
  </MyContextProvider>
)
