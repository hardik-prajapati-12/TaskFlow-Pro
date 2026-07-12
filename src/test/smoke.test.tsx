import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );
}

function main() {
  const el = document.querySelector('main');
  if (!el) throw new Error('<main> not found');
  return el as HTMLElement;
}

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('DocVault', () => {
  it('renders the dashboard empty state on first load', async () => {
    renderApp();
    expect(await screen.findByText(/welcome to docvault/i)).toBeInTheDocument();
  });

  it('creates a task from the dashboard empty state and updates stats', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(await screen.findByRole('button', { name: /create your first task/i }));
    await user.type(await screen.findByLabelText(/^title$/i), 'Write project proposal');
    await user.click(screen.getByRole('button', { name: /^create task$/i }));

    // Dashboard should now show the full stats view instead of the empty state.
    expect(await screen.findByText(/total tasks/i)).toBeInTheDocument();
    expect(within(main()).getAllByText('1').length).toBeGreaterThan(0);
  });

  it('creates, completes, and deletes a task from the Tasks page', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(await screen.findByRole('link', { name: /^tasks$/i }));
    await user.click(await within(main()).findByRole('button', { name: /^new task$/i }));

    await user.type(await screen.findByLabelText(/^title$/i), 'Ship the release');
    await user.click(screen.getByRole('button', { name: /^create task$/i }));

    expect(await screen.findByText('Ship the release')).toBeInTheDocument();

    const completeToggle = await screen.findByRole('button', {
      name: /mark "ship the release" as complete/i,
    });
    await user.click(completeToggle);
    expect(
      await screen.findByRole('button', { name: /mark "ship the release" as not complete/i }),
    ).toBeInTheDocument();

    const moreActions = screen.getByRole('button', { name: /more actions for ship the release/i });
    await user.click(moreActions);
    await user.click(screen.getByRole('menuitem', { name: /delete/i }));

    const confirmDialog = await screen.findByRole('dialog', { name: /delete this task/i });
    await user.click(within(confirmDialog).getByRole('button', { name: /^delete$/i }));

    expect(await screen.findByText(/no tasks here yet/i)).toBeInTheDocument();
  });

  it('navigates to Calendar, Statistics, and Settings without crashing', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(await screen.findByRole('link', { name: /calendar/i }));
    expect(await screen.findByRole('heading', { name: /^calendar$/i }, { timeout: 10000 })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /statistics/i }));
    expect(await screen.findByRole('heading', { name: /^statistics$/i }, { timeout: 10000 })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /settings/i }));
    expect(await screen.findByRole('heading', { name: /^settings$/i }, { timeout: 10000 })).toBeInTheDocument();
  }, 20000);

  it('toggles dark mode via the theme switcher', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(await screen.findByRole('radio', { name: /dark theme/i }));
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    await user.click(screen.getByRole('radio', { name: /light theme/i }));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('opens the create-task modal with Ctrl+N and closes it with Escape', async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByText(/welcome to docvault/i);

    await user.keyboard('{Control>}n{/Control}');
    expect(await screen.findByRole('dialog', { name: /create a new task/i })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });
    expect(screen.queryByRole('dialog', { name: /create a new task/i })).not.toBeInTheDocument();
  });

  it('correctly handles recurring task completion and undo completion without duplicating next occurrence', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(await screen.findByRole('link', { name: /^tasks$/i }));
    await user.click(await within(main()).findByRole('button', { name: /^new task$/i }));

    await user.type(await screen.findByLabelText(/^title$/i), 'Recurring Workout');
    await user.selectOptions(await screen.findByLabelText(/^repeat$/i), 'daily');
    await user.click(screen.getByRole('button', { name: /^create task$/i }));

    expect(await screen.findByText('Recurring Workout')).toBeInTheDocument();

    const completeToggle = await screen.findByRole('button', {
      name: /mark "recurring workout" as complete/i,
    });
    await user.click(completeToggle);

    const items = await screen.findAllByText('Recurring Workout');
    expect(items.length).toBe(2);

    const incompleteToggle = await screen.findByRole('button', {
      name: /mark "recurring workout" as not complete/i,
    });
    await user.click(incompleteToggle);

    const itemsAfterUndo = await screen.findAllByText('Recurring Workout');
    expect(itemsAfterUndo.length).toBe(1);
  });

  it('allows deleting any category (including default ones) and moves tasks to fallback category', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(await screen.findByRole('link', { name: /^tasks$/i }));
    await user.click(await within(main()).findByRole('button', { name: /^new task$/i }));
    await user.type(await screen.findByLabelText(/^title$/i), 'My Test Task');
    await user.selectOptions(await screen.findByLabelText(/^category$/i), 'work');
    await user.click(screen.getByRole('button', { name: /^create task$/i }));

    expect(await screen.findByText('My Test Task')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /settings/i }));

    const deleteWorkBtn = await screen.findByRole('button', { name: /delete work category/i });
    await user.click(deleteWorkBtn);

    const confirmDialog = await screen.findByRole('dialog', { name: /delete "work"/i });
    await user.click(within(confirmDialog).getByRole('button', { name: /^delete$/i }));

    expect(screen.queryByRole('button', { name: /delete work category/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /^tasks$/i }));
    const personalElements = await screen.findAllByText('Personal');
    expect(personalElements.length).toBeGreaterThan(0);
  });
});
