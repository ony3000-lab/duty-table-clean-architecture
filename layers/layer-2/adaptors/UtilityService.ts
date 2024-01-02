import type { UtilityService } from 'layer-1/ports';
import { shuffle } from 'radash';

export const utilityService: UtilityService = {
  shuffle(list) {
    return shuffle(list);
  },
};
