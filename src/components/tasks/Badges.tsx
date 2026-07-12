import { FiFlag } from 'react-icons/fi';
import type { Category, Priority } from '@/types';
import { PRIORITIES } from '@/constants/priorities';
import { Badge } from '@/components/ui/Badge';

export function PriorityBadge({ priority }: { priority: Priority }) {
  const meta = PRIORITIES.find((p) => p.value === priority) ?? PRIORITIES[1];
  return (
    <Badge
      icon={<FiFlag className="h-3 w-3" aria-hidden="true" />}
      style={{ color: meta.color, backgroundColor: `${meta.color}1A` }}
    >
      {meta.label}
    </Badge>
  );
}

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <Badge style={{ color: category.color, backgroundColor: `${category.color}1A` }}>
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: category.color }}
        aria-hidden="true"
      />
      {category.name}
    </Badge>
  );
}
