// src/components/ui/StatusBadge.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { StatusBadge } from './StatusBadge'

const meta: Meta<typeof StatusBadge> = {
  title: 'UI/StatusBadge',
  component: StatusBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StatusBadge>

export const Applied: Story = { args: { status: 'applied' } }
export const Interviewing: Story = { args: { status: 'interviewing' } }
export const Offered: Story = { args: { status: 'offered' } }
export const Rejected: Story = { args: { status: 'rejected' } }
export const Withdrawn: Story = { args: { status: 'withdrawn' } }

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatusBadge status="applied" />
      <StatusBadge status="interviewing" />
      <StatusBadge status="offered" />
      <StatusBadge status="rejected" />
      <StatusBadge status="withdrawn" />
    </div>
  ),
}
