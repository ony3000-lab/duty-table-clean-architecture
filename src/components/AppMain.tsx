import classNames from 'classnames';
import type { ComponentProps } from 'react';

import { pretendard } from '@/fonts';

export default function AppMain({ children }: ComponentProps<'main'>) {
  return (
    <main className={classNames(pretendard.variable, 'font-sans')}>
      {children}
    </main>
  );
}
