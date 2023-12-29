import type { UtilityService } from 'layer-1/ports';

export const utilityService: UtilityService = {
  shuffle(list) {
    if (list.length <= 1) {
      return list;
    }

    const shuffledIndexes = [...Array(list.length)]
      .map((_, index) => ({ index, key: Math.random() }))
      .sort((former, latter) => former.key - latter.key)
      .map(({ index }) => index);

    return list.map((_, index) => list[shuffledIndexes[index]]);
  },
};
