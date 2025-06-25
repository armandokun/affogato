export type IntegrationTool = {
  name: string
  description: string
  category: string
}

export type Integration = {
  id: string
  name: string
  description: string
  icon: string
  connectUrl: string
  externalUrl: string
  tools: Array<IntegrationTool>
}

export const AVAILABLE_INTEGRATIONS: Array<Integration> = [
  {
    id: 'linear',
    name: 'Linear',
    description: 'Project management and issue tracking for modern software teams',
    icon: '/integration-icons/linear.png',
    connectUrl: '/api/auth/linear/connect',
    externalUrl: 'https://linear.app',
    tools: [
      {
        name: 'Create Issue',
        description: 'Create a new Linear issue',
        category: 'Issue Management'
      },
      {
        name: 'List Issues',
        description: 'List issues in the user\'s Linear workspace',
        category: 'Issue Management'
      },
      {
        name: 'Get Issue',
        description: 'Retrieve a Linear issue details by ID, including attachments and git branch name',
        category: 'Issue Management'
      },
      {
        name: 'Update Issue',
        description: 'Update an existing Linear issue',
        category: 'Issue Management'
      },
      {
        name: 'List My Issues',
        description: 'List issues assigned to the current user',
        category: 'Issue Management'
      },
      {
        name: 'List Issue Statuses',
        description: 'List available issues statuses in a Linear team',
        category: 'Issue Management'
      },
      {
        name: 'Get Issue Status',
        description: 'Retrieve details of a specific issue status in Linear by name or ID',
        category: 'Issue Management'
      },
      {
        name: 'List Issue Labels',
        description: 'List available issue labels in a Linear team',
        category: 'Issue Management'
      },
      {
        name: 'Create Comment',
        description: 'Create a comment on a Linear issue by ID',
        category: 'Collaboration'
      },
      {
        name: 'List Comments',
        description: 'Retrieve comments for a Linear issue by ID',
        category: 'Collaboration'
      },
      {
        name: 'List Projects',
        description: 'List projects in the user\'s Linear workspace',
        category: 'Project Management'
      },
      {
        name: 'Get Project',
        description: 'Retrieve details of a specific project in Linear',
        category: 'Project Management'
      },
      {
        name: 'Create Project',
        description: 'Create a new project in Linear',
        category: 'Project Management'
      },
      {
        name: 'Update Project',
        description: 'Update an existing Linear project',
        category: 'Project Management'
      },
      {
        name: 'List Teams',
        description: 'List teams in the user\'s Linear workspace',
        category: 'Team Management'
      },
      {
        name: 'Get Team',
        description: 'Retrieve details of a specific Linear team',
        category: 'Team Management'
      },
      {
        name: 'List Users',
        description: 'Retrieve users in the Linear workspace',
        category: 'User Management'
      },
      {
        name: 'Get User',
        description: 'Retrieve details of a specific Linear user',
        category: 'User Management'
      },
      {
        name: 'List Documents',
        description: 'List documents in the user\'s Linear workspace',
        category: 'Documentation'
      },
      {
        name: 'Get Document',
        description: 'Retrieve a Linear document by ID or slug',
        category: 'Documentation'
      },
      {
        name: 'Search Documentation',
        description: 'Search Linear\'s documentation to learn about features and usage',
        category: 'Documentation'
      }
    ]
  }
]
