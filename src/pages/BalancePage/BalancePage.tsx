import { useState } from 'react';

import { useGameContext } from '@context/GameContext';
import { payBetween } from '@game/earnings';
import {
  EXPENSE_IDS,
  expensesBetween,
  MEAL_PRICES_CENTS,
  totalExpensesCents,
  WEEKLY_RENT_CENTS,
  type ExpenseId,
} from '@game/expenses';
import { formatMoney } from '@game/money';
import { PERIODS, periodRange, type Period } from '@game/period';
import { useSwipe } from '@hook/useSwipe';

import styles from './BalancePage.module.css';

const LINES: Record<ExpenseId, { label: string; price: string }> = {
  rent: {
    label: 'Rent',
    price: `${formatMoney(WEEKLY_RENT_CENTS, { alwaysCents: true })} / week`,
  },
  breakfast: {
    label: 'Breakfast',
    price: `${formatMoney(MEAL_PRICES_CENTS.breakfast, { alwaysCents: true })} / meal`,
  },
  lunch: {
    label: 'Lunch',
    price: `${formatMoney(MEAL_PRICES_CENTS.lunch, { alwaysCents: true })} / meal`,
  },
  dinner: {
    label: 'Dinner',
    price: `${formatMoney(MEAL_PRICES_CENTS.dinner, { alwaysCents: true })} / meal`,
  },
};

const PERIOD_LABELS: Record<Period, { tab: string; current: string }> = {
  week: { tab: 'Week', current: 'this week' },
  month: { tab: 'Month', current: 'this month' },
  year: { tab: 'Year', current: 'this year' },
};

export const BalancePage = () => {
  const { balanceCents, elapsedHours, pendingPayCents } = useGameContext();
  const [period, setPeriod] = useState<Period>('week');
  const { from, to } = periodRange(period, elapsedHours);
  const expenses = expensesBetween(from, to);
  // what was paid out plus what the ongoing week has earned so far
  const incomeCents = payBetween(from, to) + pendingPayCents;
  const costsCents = totalExpensesCents(expenses);
  const savingsCents = incomeCents - costsCents;
  const label = PERIOD_LABELS[period].current;

  // Swiping left goes to the next period, right to the previous one.
  const goTo = (step: number) => {
    const next = PERIODS[PERIODS.indexOf(period) + step];
    if (next !== undefined) setPeriod(next);
  };
  const swipe = useSwipe({
    onSwipeLeft: () => {
      goTo(1);
    },
    onSwipeRight: () => {
      goTo(-1);
    },
  });

  return (
    <section className={styles.root} {...swipe}>
      <h2 className={styles.title}>Balance</h2>
      <div className={styles.tabs} role="tablist" aria-label="Period">
        {PERIODS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={id === period}
            className={styles.tab}
            onClick={() => {
              setPeriod(id);
            }}
          >
            {PERIOD_LABELS[id].tab}
          </button>
        ))}
      </div>
      <dl className={styles.summary}>
        <div>
          <dt>In the bank</dt>
          <dd>{formatMoney(balanceCents, { alwaysCents: true })}</dd>
        </div>
        <div>
          <dt>Income {label}</dt>
          <dd className={styles.income}>
            {formatMoney(incomeCents, { alwaysCents: true })}
          </dd>
        </div>
        <div>
          <dt>Expenses {label}</dt>
          <dd className={styles.expense}>
            {formatMoney(costsCents, { alwaysCents: true })}
          </dd>
        </div>
        <div>
          <dt>Savings {label}</dt>
          <dd className={savingsCents >= 0 ? styles.income : styles.expense}>
            {formatMoney(savingsCents, { alwaysCents: true })}
          </dd>
        </div>
      </dl>
      <h3 className={styles.subtitle}>Expenses</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Expense</th>
            <th scope="col">Price</th>
            <th scope="col">Paid {label}</th>
          </tr>
        </thead>
        <tbody>
          {EXPENSE_IDS.map((id) => (
            <tr key={id}>
              <th scope="row">{LINES[id].label}</th>
              <td className={styles.price}>{LINES[id].price}</td>
              <td className={styles.amount}>
                {formatMoney(expenses[id], { alwaysCents: true })}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={2}>
              Total
            </th>
            <td className={styles.amount}>
              {formatMoney(costsCents, { alwaysCents: true })}
            </td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
};
