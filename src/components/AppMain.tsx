import type { ComponentProps } from 'react';

import { classNames } from '@/adaptors';
import { pretendard } from '@/fonts';

export default function AppMain({ children }: ComponentProps<'main'>) {
  return (
    <main className={classNames(pretendard.variable, 'font-sans')}>
      {children}
    </main>
  );
}
