// src/components/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { variant: 'primary', children: 'Add Job' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancel' },
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete' },
}

export const Outline: Story = {
  args: { variant: 'outline', children: 'View Details' },
}

export const Loading: Story = {
  args: { variant: 'primary', children: 'Saving...', loading: true },
}

export const Disabled: Story = {
  args: { variant: 'primary', children: 'Submit', disabled: true },
}

export const Small: Story = {
  args: { variant: 'primary', children: 'Small', size: 'sm' },
}

export const Large: Story = {
  args: { variant: 'primary', children: 'Large Button', size: 'lg' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button loading>Loading</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
}
