import type { UniqueIDService } from 'layer-1/ports';
import { v4 as uuid } from 'uuid';

export const uniqueIDService: UniqueIDService = {
  createID() {
    return uuid();
  },
};
