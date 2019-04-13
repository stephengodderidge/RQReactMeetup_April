import React, { useReducer, FunctionComponent } from 'react';
import { FSA } from 'types/fsa';

import { Sprites } from 'components';

type TDispatchCallback = (action: FSA) => void;

interface IUseCalculateTotals<T> {
  totals: T;
  dispatch: TDispatchCallback;
}

interface ISetTotalForKey extends FSA {
  type: 'SET_TOTAL_FOR_KEY';
  payload: {
    key: string;
    value: number;
  };
}

export const setTotalForKey = (key: string, value: number): ISetTotalForKey => ({
  type: 'SET_TOTAL_FOR_KEY',
  payload: {
    key,
    value,
  },
});

/** All app actions */
enum CalculateTotalAction {
  SET_TOTAL_FOR_KEY = 'SET_TOTAL_FOR_KEY',
}
type TCalculateTotalActions = ISetTotalForKey;

const totalsReducer = <T extends {}>(
  state: T,
  action: TCalculateTotalActions,
): T => {
  switch (action.type) {
    case CalculateTotalAction.SET_TOTAL_FOR_KEY:
      const { key, value } = action.payload;
      return {
        ...state,
        [key]: value,
      };
    default:
      throw new Error();
  }
};

interface ICalculateTotalsFor {
  [key: string]: (dataObject: {}) => number;
}

const getSafeTotal = (value: number) => {
  return !!value ? value : 0;
};

export const useCalculateTotals = <T extends { [key: string]: number | string }>(
  data: T[],
  calcTotalsFor: ICalculateTotalsFor,
): IUseCalculateTotals<T> => {
  const initialTotals = Object.keys(calcTotalsFor).reduce(
    (totals, calculationKey) => {
      if (typeof calcTotalsFor[calculationKey] === 'function') {
        const total = data.reduce(
          (currentTotal, obj) =>
            currentTotal + getSafeTotal(calcTotalsFor[calculationKey](obj)),
          0,
        );
        return {
          ...totals,
          [calculationKey]: total,
        };
      }
      return {
        ...totals,
        [calculationKey]: null,
      };
    },
    {},
  );
  const [totals, dispatch] = useReducer(totalsReducer, initialTotals);
  return {
    totals,
    dispatch,
  };
};

export const CharacterComponent: FunctionComponent<{}> = () => {
  interface ICharacterEquipment {
    name: string;
    health?: number;
    armor?: number;
    damage?: number;
    level: number;
  }

  const character = {
    name: 'My Character',
    equipment: [
      {
        name: 'Helmet',
        armor: 10,
        health: 10,
        level: 1,
      },
      {
        name: 'Sword',
        damage: 5,
        level: 3,
      },
      {
        name: 'Lucky Charm',
        health: 5,
        level: 5,
      },
      {
        name: 'Unlucky Charm',
        health: -1,
        level: 3,
      },
    ],
  };

  const calcTotalsFor = {
    health: (equipment: ICharacterEquipment) => equipment.health * equipment.level,
    armor: (equipment: ICharacterEquipment) => equipment.armor * equipment.level,
    damage: (equipment: ICharacterEquipment) => equipment.damage * equipment.level,
  };
  const { totals, dispatch } = useCalculateTotals(
    character.equipment,
    calcTotalsFor,
  );

  return (
    <div>
      {Object.values(Sprites).map(Sprite => (
        <Sprite key={Sprite.displayName} />
      ))}
    </div>
  );
};
