import { createContext, useContext } from 'react'

/**
 * App-shell state the pages need:
 *  ready         – the preloader has lifted, entrance animations may play
 *  sectionsReady – the home page's lazy sections are mounted (nav anchors, hash scroll)
 */
export const AppContext = createContext({ ready: true, sectionsReady: false, setSectionsReady: () => {} })
export const useApp = () => useContext(AppContext)
