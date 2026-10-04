import { useGameContext } from '@context/GameContext';
import {
  EXPENSE_IDS,
  MEAL_PRICES_CENTS,
  totalExpensesCents,
  WEEKLY_RENT_CENTS,
  type ExpenseId,
} from '@game/expenses';
import { formatMoney } from '@game/money';

import styles from './ExpensesPage.module.css';

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

export const ExpensesPage = () => {
  const { expenses } = useGameContext();

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>Expenses</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Expense</th>
            <th scope="col">Price</th>
            <th scope="col">Paid so far</th>
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
              {formatMoney(totalExpensesCents(expenses), { alwaysCents: true })}
            </td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
};
