// src/components/ui/JobCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { JobCard } from './JobCard'
import type { JobApplication } from '../../types'

const mockJob: JobApplication = {
  id: 1,
  company: 'Google Australia',
  position: 'Frontend Developer',
  status: 'interviewing',
  applied_date: '2025-04-15',
  days_since_applied: 20,
  notes: 'Had a great first interview. Second round scheduled for next week.',
  job_url: 'https://careers.google.com',
  salary_range: 'AUD $90k - $120k',
  created_at: '2025-04-15T00:00:00Z',
  updated_at: '2025-04-20T00:00:00Z',
}

const meta: Meta<typeof JobCard> = {
  title: 'UI/JobCard',
  component: JobCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-96"><Story /></div>],
}

export default meta
type Story = StoryObj<typeof JobCard>

export const Applied: Story = {
  args: { job: { ...mockJob, status: 'applied', notes: '' } },
}
export const Interviewing: Story = {
  args: { job: mockJob },
}
export const Offered: Story = {
  args: { job: { ...mockJob, status: 'offered', company: 'Atlassian', notes: 'Great offer!' } },
}
export const Rejected: Story = {
  args: { job: { ...mockJob, status: 'rejected', notes: 'Not a good fit at this time.' } },
}
export const WithoutNotes: Story = {
  args: { job: { ...mockJob, notes: '', salary_range: '' } },
}

export const JobList: Story = {
  render: () => (
    <div className="w-96 space-y-3">
      <JobCard job={{ ...mockJob, status: 'applied', company: 'Canva', position: 'React Developer' }} />
      <JobCard job={{ ...mockJob, status: 'interviewing', company: 'Atlassian', position: 'Senior Frontend' }} />
      <JobCard job={{ ...mockJob, status: 'offered', company: 'Afterpay', position: 'Full Stack Developer' }} />
    </div>
  ),
}
