import { stateReducer } from 'modules/app/state-reducer';
import React, { createContext } from 'react';
import { FSA } from 'types/fsa';
import * as AppState from 'types/react-context-provider';
import { hydrateStateWithLocalStorage, updateLocalStorage } from './local-storage';

import {LeftRightTemplateWithLabel} from 'components/templates';

/** App Context - Provider & Consumer */
export const AppContext = createContext(AppState.initialState);

/** App state provider for overall application */
export class App extends AppState.ContextProvider {
  constructor(props: null) {
    super(props);

    const hydratedState = hydrateStateWithLocalStorage(AppState.initialState);

    this.state = {
      ...hydratedState,
      dispatch: this.updateApp,
    };
    this.updateApp = this.updateApp.bind(this);
  }

  updateApp(action: FSA): void {
    this.setState(stateReducer(this.state, action));
  }

  getContextValue(): AppState.IAppState {
    return {
      ...this.state,
    };
  }

  render() {
    updateLocalStorage(this.state);
    return (
      <AppContext.Provider value={this.getContextValue()}>
        Layout Template goes here!
        <LeftRightTemplateWithLabel title="Test Label">
          {{
            Left: [1, 2, 3].map(n => {return n*2}),
            Right: <div>hello world</div>
          }}
        </LeftRightTemplateWithLabel>
      </AppContext.Provider>
    );
  }
}
