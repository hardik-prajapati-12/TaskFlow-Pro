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
    expect(await screen.findByRole('heading', { name: /^calendar$/i }, { timeout: 5000 })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /statistics/i }));
    expect(await screen.findByRole('heading', { name: /^statistics$/i }, { timeout: 5000 })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /settings/i }));
    expect(await screen.findByRole('heading', { name: /^settings$/i }, { timeout: 5000 })).toBeInTheDocument();
  });

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
});
