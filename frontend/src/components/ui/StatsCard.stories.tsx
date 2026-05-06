// src/components/ui/StatsCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { StatsCard } from './StatsCard'

const meta: Meta<typeof StatsCard> = {
  title: 'UI/StatsCard',
  component: StatsCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StatsCard>

export const Total: Story = {
  args: { title: 'Total Applications', value: 24, icon: '📋', color: 'purple', subtitle: 'All time' },
}
export const Applied: Story = {
  args: { title: 'Applied', value: 12, icon: '📤', color: 'blue' },
}
export const Interviewing: Story = {
  args: { title: 'Interviewing', value: 5, icon: '🎯', color: 'yellow' },
}
export const Offered: Story = {
  args: { title: 'Offered', value: 2, icon: '🎉', color: 'green', subtitle: '8.3% success rate' },
}
export const Rejected: Story = {
  args: { title: 'Rejected', value: 5, icon: '❌', color: 'red' },
}

export const DashboardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-96">
      <StatsCard title="Total" value={24} icon="📋" color="purple" />
      <StatsCard title="Applied" value={12} icon="📤" color="blue" />
      <StatsCard title="Interviewing" value={5} icon="🎯" color="yellow" />
      <StatsCard title="Offered" value={2} icon="🎉" color="green" subtitle="8.3% rate" />
    </div>
  ),
}
