import type { Meta, StoryObj } from '@storybook/react'
import { AIModal } from '../components/ui/AIModal'

const meta: Meta<typeof AIModal> = {
  title: 'UI/AIModal',
  component: AIModal,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AIModal>

const mockSuggestion = {
  subject: 'Following Up – Frontend Developer at Google Australia',
  body: 'Dear Hiring Manager,\n\nI wanted to follow up on my application.\n\nBest regards,\nChatrudee',
  full: 'Subject: Following Up...\n\nDear Hiring Manager...',
  job: { company: 'Google Australia', position: 'Frontend Developer', status: 'applied' },
}

export const Loading: Story = {
  args: { isOpen: true, loading: true, jobTitle: 'Frontend Developer @ Google' },
}
export const WithSuggestion: Story = {
  args: { isOpen: true, suggestion: mockSuggestion, jobTitle: 'Frontend Developer @ Google' },
}
export const WithError: Story = {
  args: { isOpen: true, error: 'AI service error.', jobTitle: 'Frontend Developer @ Google' },
}
