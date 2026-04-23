import { createBrowserRouter } from 'react-router'

import { GamePage } from '@/pages/GamePage'
import { ShowcasePage } from '@/pages/ShowcasePage'
import { HomePage } from '@/pages/HomePage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/pokers',
    Component: ShowcasePage,
  },
  {
    path: '/24-game',
    Component: GamePage,
  },
])
