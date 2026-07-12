import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMaximize, FiMenu, FiMinimize, FiPlus, FiSearch } from 'react-icons/fi';
import { useTasks } from '@/hooks/useTasks';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { ThemeSwitcher } from './ThemeSwitcher';

export interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate();
  const { openCreateForm, searchInputRef } = useTasks();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const handleSearchClick = () => {
    navigate('/tasks');
    window.setTimeout(() => searchInputRef.current?.focus(), 150);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen request failed', error);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink-100/80 bg-white/70 px-4 py-3 backdrop-blur-xl dark:border-ink-700/60 dark:bg-ink-900/60 sm:px-6">
      <IconButton icon={<FiMenu aria-hidden="true" />} label="Open menu" onClick={onMenuClick} className="md:hidden" />

      <div className="flex flex-1 items-center justify-end gap-2">
        <IconButton
          icon={<FiSearch aria-hidden="true" />}
          label="Search tasks"
          onClick={handleSearchClick}
          className="sm:hidden"
        />
        <button
          type="button"
          onClick={handleSearchClick}
          className="input-base hidden w-64 items-center gap-2 text-left text-ink-400 hover:border-flow-400 sm:flex"
        >
          <FiSearch aria-hidden="true" />
          <span className="flex-1 text-sm">Search tasks...</span>
          <span className="kbd">Ctrl F</span>
        </button>

        <IconButton
          icon={isFullscreen ? <FiMinimize aria-hidden="true" /> : <FiMaximize aria-hidden="true" />}
          label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          onClick={toggleFullscreen}
        />

        <ThemeSwitcher />

        <Button leftIcon={<FiPlus aria-hidden="true" />} onClick={openCreateForm} className="hidden sm:inline-flex">
          New Task
        </Button>
        <IconButton
          icon={<FiPlus aria-hidden="true" />}
          label="New task"
          variant="primary"
          onClick={openCreateForm}
          className="sm:hidden"
        />
      </div>
    </header>
  );
}
